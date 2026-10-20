//
//  VistaSpesa.swift — la lista della spesa
//
//  Gli alimenti del piano, per reparto, con la spunta: la stessa lista (e le stesse spunte)
//  dell'app sul telefono. Un tocco mette o toglie la spunta; gli alimenti presi scendono in
//  fondo al reparto, barrati.
//
//  Versione .46: due liste, come nell'app: «Oggi» (il giorno del piano, come prima) e
//  «Settimana» (la settimana del piano a cui appartiene oggi; un piano senza settimane: tutto il
//  piano). Ognuna ha le sue spunte, le stesse della scheda corrispondente sul telefono. La scelta
//  resta per le volte dopo. Con un portale non ancora aggiornato c'e' solo «Oggi».
//  Si apre dalla dieta: per tornarci, ‹ in alto a sinistra, il pulsante 🍴 in basso a sinistra o
//  «Torna alla dieta» in fondo all'elenco. In alto una riga sola (scelta della lista e conteggio):
//  il resto dello schermo e' per gli alimenti.
//

import SwiftUI

struct VistaSpesa: View {
    @ObservedObject var modello: ModelloOggi
    var tornaAllaDieta: () -> Void = {}
    // le due scelte restano anche tornando alla dieta a meta' spesa (la schermata si riapre ogni volta)
    @AppStorage("spesa-mostra-presi") private var mostraPresi = true
    @AppStorage("spesa-settimana") private var settimana = false

    // niente NavigationStack qui: c'e' gia' quello attorno (VistaPrincipale)
    var body: some View {
        contenuto
            .navigationTitle("Spesa")
            .toolbar {
                ToolbarItemGroup(placement: .bottomBar) {
                    BottoneDieta(azione: tornaAllaDieta)
                    Spacer()
                    BottoneAggiorna(modello: modello)
                }
            }
    }

    /// La lista mostrata: quella della settimana solo se l'API la manda.
    private func scelta(_ d: Oggi) -> (Spesa?, Bool) {
        if settimana, let s = d.spesaSettimana { return (s, true) }
        return (d.spesa, false)
    }

    @ViewBuilder private var contenuto: some View {
        if let d = modello.dati {
            let lista = scelta(d).0
            let diSettimana = scelta(d).1
            if d.giorno == nil {
                List {
                    RigaMessaggio(icona: "cart", testo: "Non hai ancora un piano alimentare attivo.")
                    RigaTornaAllaDieta(azione: tornaAllaDieta)
                }
            } else if let s = lista, s.errore == nil, !(s.reparti ?? []).isEmpty {
                elenco(d, s, diSettimana)
            } else {
                // anche senza alimenti si puo' passare all'altra lista
                List {
                    selettore(d)
                    RigaMessaggio(icona: lista?.errore != nil ? "cart.badge.questionmark" : "cart",
                                  testo: lista?.errore ?? (diSettimana ? "Nessun alimento nella lista della settimana." : "Nessun alimento nella lista di oggi."))
                    RigaTornaAllaDieta(azione: tornaAllaDieta)
                }
            }
        } else if modello.caricamento {
            ProgressView("Carico la spesa…")
        } else if let e = modello.errore {
            VistaMessaggio(icona: "wifi.exclamationmark", testo: e) { Task { await modello.carica() } }
        } else {
            ProgressView()
        }
    }

    /// «Oggi» / «Settimana»: due pulsanti a capsula (nella stessa riga di un elenco servono .plain,
    /// altrimenti watchOS li tratta come un unico pulsante).
    @ViewBuilder private func selettore(_ d: Oggi) -> some View {
        if d.spesaSettimana != nil {
            HStack(spacing: 6) {
                capsula("Oggi", attiva: !settimana) { settimana = false }
                capsula(etichettaSettimana(d), attiva: settimana) { settimana = true }
            }
            .listRowBackground(Color.clear)
        }
    }

    private func etichettaSettimana(_ d: Oggi) -> String {
        if let n = d.spesaSettimana?.settimana, n > 0 { return "Settimana \(n)" }
        return "Settimana"
    }

    private func capsula(_ testo: String, attiva: Bool, azione: @escaping () -> Void) -> some View {
        Button(action: azione) {
            Text(testo)
                .font(.footnote.weight(attiva ? .semibold : .regular))
                .lineLimit(1).minimumScaleFactor(0.7)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 6)
                .background(Capsule().fill(attiva ? Colori.verde : Color.gray.opacity(0.25)))
                .foregroundStyle(attiva ? Color.white : Color.primary)
        }
        .buttonStyle(.plain)
    }

    private func elenco(_ d: Oggi, _ s: Spesa, _ diSettimana: Bool) -> some View {
        let presi = s.voci.count - s.daPrendere
        return List {
            NotaFuoriLinea(modello: modello)
            selettore(d)
            // una riga sola (prima: titolo «Spesa per ...» piu' una riga): quanti alimenti mancano e di quale lista si
            // tratta («Martedì», o il giorno dopo se oggi e' libero; «Settimana 2»)
            HStack(alignment: .firstTextBaseline, spacing: 4) {
                Text("\(s.daPrendere)").font(.headline).foregroundStyle(Colori.verde)
                Text("da prendere").font(.caption2)
                Spacer(minLength: 2)
                if let g = s.giorno, !g.isEmpty {
                    Text(g.prefix(1).uppercased() + g.dropFirst()).font(.caption2).foregroundStyle(.secondary)
                        .lineLimit(1).minimumScaleFactor(0.7)
                }
            }
            .listRowBackground(Color.clear)
            ForEach(s.reparti ?? []) { r in
                let voci = r.voci.sorted { !$0.preso && $1.preso }
                let mostrate = mostraPresi ? voci : voci.filter { !$0.preso }
                if !mostrate.isEmpty {
                    Section(r.nome) {
                        ForEach(mostrate) { v in
                            RigaSpesa(voce: v)
                                .contentShape(Rectangle())
                                .onTapGesture { Task { await modello.cambiaSpunta(v, settimana: diSettimana) } }
                        }
                    }
                }
            }
            if presi > 0 {
                Section {
                    Button(mostraPresi ? "Nascondi ciò che ho preso (\(presi))" : "Mostra anche ciò che ho preso (\(presi))") { mostraPresi.toggle() }
                        .font(.caption)
                }
            }
            if let nr = s.nonRiconosciuti, !nr.isEmpty {
                Section("Da controllare sul piano") {
                    Text(nr.joined(separator: " · ")).font(.caption2).foregroundStyle(.secondary)
                }
            }
            if let e = modello.errore {
                Section { Text(e).font(.caption2).foregroundStyle(.red) }
            }
            RigaTornaAllaDieta(azione: tornaAllaDieta)
        }
    }
}

struct RigaSpesa: View {
    let voce: Voce

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: voce.preso ? "checkmark.circle.fill" : "circle")
                .font(.title3)
                .foregroundStyle(voce.preso ? Colori.verde : .secondary)
            VStack(alignment: .leading, spacing: 1) {
                Text(voce.alimento.prefix(1).uppercased() + voce.alimento.dropFirst())
                    .font(.body)
                    .strikethrough(voce.preso)
                    .foregroundStyle(voce.preso ? .secondary : .primary)
                if let q = voce.quantita, !q.isEmpty {
                    Text(q).font(.caption2).foregroundStyle(.secondary)
                }
            }
            Spacer(minLength: 0)
        }
        .padding(.vertical, 1)
    }
}
