//
//  ModelloOggi.swift — lo stato della giornata mostrato dalle viste
//
//  Un solo oggetto per le pagine (pasti, spesa, promemoria): una chiamata all'API, e le
//  modifiche si vedono subito sullo schermo e poi si mandano al server. Senza rete:
//  si mostra l'ultima giornata salvata (Archivio) e le modifiche vanno in coda, da
//  dove partono alla prima connessione. Se il server rifiuta una modifica (risposta
//  4xx) si torna indietro e si mostra il motivo.
//

import Foundation
import Combine

@MainActor
final class ModelloOggi: ObservableObject {
    /// Un solo modello per tutta l'app (le viste e l'aggiornamento in sottofondo lo condividono).
    static let condiviso = ModelloOggi()

    @Published var dati: Oggi?
    @Published var caricamento = false
    @Published var errore: String?
    @Published var ultimoAggiornamento: Date?
    @Published var fuoriLinea = false              // si stanno mostrando dati salvati, non appena scaricati
    @Published var inAttesa = Archivio.coda().count // modifiche fatte senza rete, non ancora inviate

    private var sessione: Sessione { Sessione.condivisa }
    private var api: ApiClient { ApiClient(base: sessione.apiBase, token: sessione.token) }
    private var inCorso = false
    private var ricaricaDopo = false      // chiesto un caricamento con un accesso nuovo mentre ne girava uno: si rifa'
    private var tokenInUso = ""           // l'accesso del caricamento in corso

    nonisolated init() {}

    /// Scarica la giornata. "silenzioso" non mostra la rotella (ritorno in primo piano, sottofondo).
    func carica(silenzioso: Bool = false) async {
        guard sessione.haAccesso else { dati = nil; return }
        if inCorso { if sessione.token != tokenInUso { ricaricaDopo = true }; return }
        inCorso = true; tokenInUso = sessione.token
        defer {
            inCorso = false
            // per esempio e' arrivato un accesso nuovo mentre si scaricava con quello di prima
            if ricaricaDopo { ricaricaDopo = false; Task { await self.carica(silenzioso: true) } }
        }
        if !silenzioso || dati == nil { caricamento = true }
        defer { caricamento = false }
        await svuotaCoda()
        guard sessione.haAccesso else { dati = nil; inAttesa = 0; return }   // 401 mentre si svuotava la coda
        do {
            let nuovi = try await api.oggi()
            // se qualcosa e' rimasto in coda (rete tornata e subito sparita) lo si mostra lo stesso
            let vista = Archivio.applica(Archivio.coda(), a: nuovi)
            dati = vista
            fuoriLinea = false
            errore = nil
            ultimoAggiornamento = Date()
            Archivio.salva(nuovi)
            Promemoria.condiviso.pianifica(con: vista)          // con i segni ancora in coda: niente promemoria per un pasto gia' segnato
            Aggiornamento.programma()
        } catch ErroreApi.sessioneScaduta(let usato) {
            accessoTolto(usato)
        } catch ErroreApi.rete {
            // caricamento interrotto (tempo in sottofondo finito): non e' mancanza di rete, si lascia tutto com'e'
            guard !Task.isCancelled else { return }
            // niente rete: l'ultima giornata salvata, con le modifiche in coda applicate sopra
            if let s = Archivio.leggi() {
                dati = Archivio.applica(Archivio.coda(), a: s.dati)
                ultimoAggiornamento = s.quando
                fuoriLinea = true
                errore = nil
            } else {
                errore = "Nessuna connessione e nessun dato salvato: apri l'app una prima volta con la rete."
            }
        } catch {
            errore = error.localizedDescription
        }
    }

    /// Dopo un 401: se l'accesso e' stato tolto davvero (vedi Sessione.scaduta), via anche giornata salvata, coda e
    /// promemoria dei pasti. Versione .46: prima i promemoria restavano programmati (fino a 4 giorni) con l'accesso
    /// chiuso dallo studio o l'account cancellato, e segnando un pasto restavano sull'orologio giornata e coda.
    private func accessoTolto(_ usato: String) {
        guard sessione.scaduta(usato) else { return }
        dati = nil
        Archivio.cancellaTutto(); inAttesa = 0
        Promemoria.condiviso.cancellaTutti()
    }

    /// Chiamato dal sistema in sottofondo (vedi DelegatoWatch): aggiorna e ripianifica i promemoria.
    func aggiornaInSottofondo() async {
        sessione.ricaricaDalPortachiavi()
        await carica(silenzioso: true)
    }

    /// Manda al server le operazioni fatte senza rete, nell'ordine; si ferma alla prima mancanza di rete.
    /// La coda si rilegge a ogni passo e si toglie solo l'operazione mandata: prima si riscriveva la copia
    /// presa all'inizio, e un pasto segnato intanto senza rete andava perso.
    func svuotaCoda() async {
        guard sessione.haAccesso else { inAttesa = Archivio.coda().count; return }
        var giri = 0
        while giri < 100, let op = Archivio.coda().first {
            giri += 1
            do {
                switch op.tipo {
                case .esito: try await api.segnaPasto(data: op.data ?? "", pasto: op.pasto ?? "", esito: op.esito)
                case .spunta: try await api.spuntaSpesa(piano: op.piano ?? "", chiave: op.chiave ?? 0, alimento: op.alimento ?? "", preso: op.preso ?? false)
                }
                Archivio.togli(op)
            } catch ErroreApi.rete {
                break                                          // si riprova alla prossima connessione
            } catch ErroreApi.sessioneScaduta(let usato) {
                accessoTolto(usato)                            // giornata salvata, coda e promemoria: non valgono piu'
                break
            } catch {
                Archivio.togli(op)                             // rifiutata dal server (4xx): non ha senso riprovarla
            }
        }
        inAttesa = Archivio.coda().count
    }

    /// Segna un pasto: "fatto", "saltato" o nil (toglie il segno).
    func cambiaEsito(_ p: Pasto, _ nuovo: String?) async {
        guard var d = dati, let i = d.pasti.firstIndex(where: { $0.pasto == p.pasto }) else { return }
        let prima = d.pasti[i].esito
        d.pasti[i].esito = nuovo
        dati = d
        Promemoria.condiviso.pianifica(con: d)   // un pasto segnato non ha piu' bisogno del promemoria
        do {
            try await api.segnaPasto(data: d.data, pasto: p.pasto, esito: nuovo)
            errore = nil
        } catch ErroreApi.rete {
            Archivio.accoda(OperazioneInAttesa(tipo: .esito, quando: Date(), data: d.data, pasto: p.pasto, esito: nuovo))
            Archivio.salva(d); inAttesa = Archivio.coda().count; fuoriLinea = true
        } catch ErroreApi.sessioneScaduta(let usato) {
            accessoTolto(usato)
        } catch {
            if var d2 = dati, let j = d2.pasti.firstIndex(where: { $0.pasto == p.pasto }) { d2.pasti[j].esito = prima; dati = d2 }
            errore = error.localizedDescription
        }
    }

    /// Spunta (o toglie la spunta a) un alimento della lista di oggi o, con settimana=true, di quella della settimana
    /// (le due liste hanno spunte separate, come nell'app sul telefono).
    func cambiaSpunta(_ v: Voce, settimana: Bool = false) async {
        let kp: WritableKeyPath<Oggi, Spesa?> = settimana ? \.spesaSettimana : \.spesa
        guard var d = dati, var spesa = d[keyPath: kp], let piano = spesa.piano, let chiave = spesa.chiave,
              var reparti = spesa.reparti else { return }
        var trovato = false
        for r in reparti.indices {
            if let k = reparti[r].voci.firstIndex(where: { $0.alimento == v.alimento }) {
                reparti[r].voci[k].preso = !v.preso; trovato = true    // lo stesso valore che va al server
            }
        }
        guard trovato else { return }
        spesa.reparti = reparti; d[keyPath: kp] = spesa; dati = d
        do {
            try await api.spuntaSpesa(piano: piano, chiave: chiave, alimento: v.alimento, preso: !v.preso)
            errore = nil
        } catch ErroreApi.rete {
            Archivio.accoda(OperazioneInAttesa(tipo: .spunta, quando: Date(), piano: piano, chiave: chiave, alimento: v.alimento, preso: !v.preso))
            Archivio.salva(d); inAttesa = Archivio.coda().count; fuoriLinea = true
        } catch ErroreApi.sessioneScaduta(let usato) {
            accessoTolto(usato)
        } catch {
            // si torna allo stato di prima
            if var d2 = dati, var s2 = d2[keyPath: kp], var r2 = s2.reparti {
                for r in r2.indices {
                    if let k = r2[r].voci.firstIndex(where: { $0.alimento == v.alimento }) { r2[r].voci[k].preso = v.preso }
                }
                s2.reparti = r2; d2[keyPath: kp] = s2; dati = d2
            }
            errore = error.localizedDescription
        }
    }

    /// Testo breve per le viste: "dati delle 18:30" quando si e' senza rete.
    var notaFuoriLinea: String? {
        guard fuoriLinea else { return nil }
        let f = DateFormatter(); f.locale = Locale(identifier: "it_IT")
        if let q = ultimoAggiornamento {
            f.dateFormat = Calendar.current.isDateInToday(q) ? "'delle' HH:mm" : "'di' EEEE d MMMM 'alle' HH:mm"
            return "Senza rete: dati \(f.string(from: q))." + (inAttesa > 0 ? " \(inAttesa) modific\(inAttesa == 1 ? "a" : "he") in attesa." : "")
        }
        return "Senza rete."
    }
}
