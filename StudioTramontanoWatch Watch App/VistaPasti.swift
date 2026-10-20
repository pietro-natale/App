//
//  VistaPasti.swift — la dieta di oggi: la schermata principale dell'app
//
//  I cinque pasti del giorno del piano e lo stato segnato nel diario. Un tocco segna il pasto "fatto";
//  scorrendo la riga verso sinistra lo si segna "saltato". E' lo stesso diario che il paziente vede sul
//  telefono e la dottoressa nel programma.
//
//  Versione .46 (richieste dello studio):
//   - un pasto segnato FATTO scende nella sezione «Pasti fatti», in fondo: in alto restano quelli ancora
//     da fare. Da li' un tocco toglie il segno e il pasto torna su;
//   - testo dei pasti piu' grande (tutti, non solo pranzo e cena);
//   - in alto, come titolo, solo il giorno del piano («Martedì»): niente data e niente riga in piu', piu'
//     spazio ai pasti; le kcal del giorno in piccolo sopra i pasti;
//   - questa e' la schermata principale: in fondo le voci Lista della spesa, Appuntamento e Promemoria
//     (ognuna con un'indicazione: quanti alimenti da prendere, quando e' l'appuntamento, promemoria attivi o
//     no), che si aprono con il pulsante indietro di watchOS; la spesa anche dal pulsante 🛒 in basso;
//   - un appuntamento di oggi o di domani compare in alto, sopra i pasti.
//

import SwiftUI

/// Le schermate che si aprono dalla dieta (con il pulsante indietro in alto a sinistra).
enum Destinazione: Hashable {
    case spesa, appuntamento, promemoria
}

struct VistaPasti: View {
    @ObservedObject var modello: ModelloOggi
    /// apre una delle altre schermate (il percorso e' in VistaPrincipale)
    var vai: (Destinazione) -> Void = { _ in }
    @ObservedObject private var promemoria = Promemoria.condiviso
    /// la lista che si apre nella spesa (la stessa scelta di VistaSpesa): il conteggio qui e' di quella
    @AppStorage("spesa-settimana") private var spesaSettimana = false

    /// il titolo in alto: il giorno del piano («Martedì»), senza la data
    private var titolo: String {
        let l = modello.dati?.giorno?.label.trimmingCharacters(in: .whitespaces) ?? ""
        return l.isEmpty ? "Oggi" : l
    }

    // niente NavigationStack qui: c'e' gia' quello attorno (VistaPrincipale)
    var body: some View {
        contenuto
            .navigationTitle(titolo)
            .toolbar {
                ToolbarItemGroup(placement: .bottomBar) {
                    Button { vai(.spesa) } label: {
                        Label("Lista della spesa", systemImage: "cart")
                    }
                    Spacer()
                    BottoneAggiorna(modello: modello)
                }
            }
    }

    @ViewBuilder private var contenuto: some View {
        if let d = modello.dati {
            elenco(d)
        } else if modello.caricamento {
            ProgressView("Carico la giornata…")
        } else if let e = modello.errore {
            // giornata non arrivata: il messaggio, «Riprova» e le altre voci (i promemoria si regolano lo stesso)
            List {
                RigaMessaggio(icona: "wifi.exclamationmark", testo: e)
                Button { Task { await modello.carica() } } label: {
                    Label("Riprova", systemImage: "arrow.clockwise").font(.footnote.weight(.semibold))
                }
                .foregroundStyle(Colori.verde)
                altreVoci(nil)
            }
        } else {
            ProgressView()
        }
    }

    private func elenco(_ d: Oggi) -> some View {
        let daFare = d.pasti.filter { !$0.fatto }
        let fatti = d.pasti.filter { $0.fatto }
        let prossimo = d.prossimiAppuntamenti?.first
        return List {
            NotaFuoriLinea(modello: modello)
            // l'appuntamento di oggi o di domani, sopra i pasti: tocca per i dettagli
            if let a = prossimo, (Agenda.giorniDa(a) ?? 99) <= 1 {
                NavigationLink(value: Destinazione.appuntamento) {
                    RigaAvvisoAppuntamento(appuntamento: a)
                }
            }
            if d.giorno == nil {
                RigaMessaggio(icona: "fork.knife", testo: "Non hai ancora un piano alimentare attivo.")
            } else if d.giorno?.libero == true {
                RigaMessaggio(icona: "sun.max", testo: "Giorno libero del piano: segui le indicazioni generali della dottoressa.")
            } else if d.pasti.isEmpty {
                RigaMessaggio(icona: "fork.knife", testo: "Nessun pasto indicato per oggi.")
            } else {
                Section {
                    if daFare.isEmpty {
                        Text("Tutti i pasti di oggi sono segnati come fatti.")
                            .font(.footnote).foregroundStyle(Colori.verde)
                    }
                    ForEach(daFare) { p in
                        RigaPasto(pasto: p)
                            .contentShape(Rectangle())
                            .onTapGesture { Task { await modello.cambiaEsito(p, "fatto") } }
                            .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                                Button {
                                    Task { await modello.cambiaEsito(p, p.saltato ? nil : "saltato") }
                                } label: {
                                    Label(p.saltato ? "Togli" : "Saltato", systemImage: p.saltato ? "arrow.uturn.left" : "xmark")
                                }
                                .tint(Colori.ambra)
                            }
                    }
                } header: {
                    if let k = d.kcal, k > 0 {
                        Text("\(k) kcal in tutto").font(.caption2).textCase(nil)
                    }
                } footer: {
                    Text("Tocca un pasto quando l'hai fatto; scorri a sinistra per \u{201C}saltato\u{201D}.")
                        .font(.caption2)
                }
                if !fatti.isEmpty {
                    Section {
                        ForEach(fatti) { p in
                            RigaPastoFatto(pasto: p)
                                .contentShape(Rectangle())
                                .onTapGesture { Task { await modello.cambiaEsito(p, nil) } }
                        }
                    } header: {
                        Text("Pasti fatti (\(fatti.count))").font(.footnote.weight(.semibold)).textCase(nil)
                    } footer: {
                        Text("Tocca un pasto per togliere il segno «fatto».").font(.caption2)
                    }
                }
            }
            altreVoci(d)
        }
        .animation(.default, value: d.pasti.map { $0.pasto + ":" + ($0.esito ?? "") })
    }

    /// Le altre schermate: si aprono sopra la dieta, con ‹ in alto a sinistra per tornare. Senza giornata (d nil)
    /// le voci ci sono lo stesso, senza indicazioni.
    private func altreVoci(_ d: Oggi?) -> some View {
        Section {
            NavigationLink(value: Destinazione.spesa) {
                RigaVoce(icona: "cart", titolo: "Lista della spesa", dettaglio: d.flatMap(dettaglioSpesa))
            }
            NavigationLink(value: Destinazione.appuntamento) {
                RigaVoce(icona: "calendar", titolo: "Appuntamento", dettaglio: d.flatMap(dettaglioAppuntamento))
            }
            NavigationLink(value: Destinazione.promemoria) {
                RigaVoce(icona: "bell", titolo: "Promemoria", dettaglio: promemoria.attivi ? "attivi" : "spenti")
            }
        } footer: {
            if d != nil, let e = modello.errore { Text(e).font(.caption2).foregroundStyle(.red) }
        }
    }

    /// Quanti alimenti mancano nella lista che si apre (oggi o settimana, come scelto nella spesa).
    private func dettaglioSpesa(_ d: Oggi) -> String? {
        let lista = (spesaSettimana ? d.spesaSettimana : nil) ?? d.spesa
        guard let s = lista, s.errore == nil, !(s.reparti ?? []).isEmpty else { return nil }
        return s.daPrendere == 0 ? "tutto preso" : "\(s.daPrendere) da prendere"
    }

    private func dettaglioAppuntamento(_ d: Oggi) -> String? {
        guard let elenco = d.prossimiAppuntamenti else { return nil }
        guard let a = elenco.first else { return d.appuntamentiDaAggiornare ? "da aggiornare" : "nessuno in programma" }
        return Agenda.giornoBreve(a) + " · " + Agenda.ora(a)
    }
}

/// Un pasto da fare (o saltato): etichetta, kcal e il testo del piano, grande.
struct RigaPasto: View {
    let pasto: Pasto

    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: pasto.saltato ? "xmark.circle.fill" : "circle")
                .font(.title3)
                .foregroundStyle(pasto.saltato ? Colori.ambra : .secondary)
                .padding(.top, 2)
            VStack(alignment: .leading, spacing: 2) {
                HStack(alignment: .firstTextBaseline) {
                    Text(pasto.etichetta.uppercased())
                        .font(.caption.weight(.bold))
                        .foregroundStyle(pasto.principale ? Colori.verde : .secondary)
                        .lineLimit(2).minimumScaleFactor(0.8)
                    Spacer(minLength: 4)
                    if let k = pasto.kcal, k > 0 {
                        Text("\(k) kcal").font(.caption2).foregroundStyle(.secondary)
                    }
                }
                Text(pasto.testo)
                    .font(pasto.principale ? .body.weight(.semibold) : .body)
                    .strikethrough(pasto.saltato, color: Colori.ambra)
                    .foregroundStyle(pasto.saltato ? .secondary : .primary)
                    .fixedSize(horizontal: false, vertical: true)
                if let k = pasto.alternativa {
                    Text("Alternativa \(k + 1) scelta sul telefono")
                        .font(.caption2).foregroundStyle(Colori.verde)
                }
            }
        }
        .padding(.vertical, 2)
    }
}

/// Un pasto gia' fatto, nella sezione in fondo: piu' piccolo, con la spunta.
struct RigaPastoFatto: View {
    let pasto: Pasto

    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "checkmark.circle.fill")
                .font(.title3)
                .foregroundStyle(Colori.verde)
            VStack(alignment: .leading, spacing: 2) {
                Text(pasto.etichetta)
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(Colori.verde)
                Text(pasto.testo)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
                    .lineLimit(2)
            }
        }
        .padding(.vertical, 1)
    }
}

/// Una voce che apre un'altra schermata: icona, nome e, sotto, un'indicazione breve.
struct RigaVoce: View {
    let icona: String
    let titolo: String
    var dettaglio: String? = nil

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: icona)
                .font(.body)
                .foregroundStyle(Colori.verde)
                .frame(width: 22)
            VStack(alignment: .leading, spacing: 1) {
                Text(titolo).font(.footnote.weight(.semibold)).lineLimit(1).minimumScaleFactor(0.8)
                if let d = dettaglio {
                    Text(d).font(.caption2).foregroundStyle(.secondary).lineLimit(1).minimumScaleFactor(0.8)
                }
            }
        }
    }
}

/// L'appuntamento di oggi o di domani, in alto nella dieta.
struct RigaAvvisoAppuntamento: View {
    let appuntamento: Appuntamento

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: "calendar")
                .font(.body)
                .foregroundStyle(Colori.verde)
                .frame(width: 22)
            VStack(alignment: .leading, spacing: 1) {
                Text("Appuntamento " + Agenda.quando(appuntamento))
                    .font(.footnote.weight(.semibold)).lineLimit(1).minimumScaleFactor(0.8)
                Text("ore " + Agenda.ora(appuntamento))
                    .font(.caption2).foregroundStyle(Colori.verde)
            }
        }
    }
}
