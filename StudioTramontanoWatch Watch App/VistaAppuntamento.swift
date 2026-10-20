//
//  VistaAppuntamento.swift — il prossimo appuntamento allo studio (versione .46)
//
//  Giorno, ora, fra quanto («domani», «tra 3 giorni»), tipo e durata; sotto, gli altri gia' fissati.
//  Arriva con la giornata (/api/mie/oggi: nessuna chiamata in piu', e la sessione dell'orologio resta
//  limitata alle sue tre chiamate), quindi si vede anche senza rete: quelli gia' passati spariscono da
//  soli. Prenotare o spostare un appuntamento resta una cosa dell'app sul telefono.
//  Si apre dalla dieta: per tornarci, ‹ in alto a sinistra, 🍴 in basso a sinistra o «Torna alla dieta».
//

import SwiftUI

struct VistaAppuntamento: View {
    @ObservedObject var modello: ModelloOggi
    var tornaAllaDieta: () -> Void = {}

    // niente NavigationStack qui: c'e' gia' quello attorno (VistaPrincipale)
    var body: some View {
        contenuto
            .navigationTitle("Appuntamento")
            .toolbar {
                ToolbarItemGroup(placement: .bottomBar) {
                    BottoneDieta(azione: tornaAllaDieta)
                    Spacer()
                    BottoneAggiorna(modello: modello)
                }
            }
    }

    @ViewBuilder private var contenuto: some View {
        if let d = modello.dati {
            List {
                NotaFuoriLinea(modello: modello)
                if let elenco = d.prossimiAppuntamenti {
                    if let a = elenco.first {
                        SchedaAppuntamento(appuntamento: a)
                        if elenco.count > 1 {
                            Section {
                                ForEach(elenco.dropFirst()) { x in
                                    HStack {
                                        Text(Agenda.giornoBreve(x)).font(.footnote)
                                        Spacer(minLength: 4)
                                        Text(Agenda.ora(x)).font(.footnote.weight(.semibold)).foregroundStyle(Colori.verde)
                                    }
                                }
                            } header: {
                                Text("Poi").font(.footnote.weight(.semibold)).textCase(nil)
                            }
                        }
                    } else if d.appuntamentiDaAggiornare {
                        // quelli salvati sono passati: potrebbero essercene altri (il portale ne manda al massimo 3)
                        RigaMessaggio(icona: "arrow.clockwise", testo: "Gli appuntamenti salvati sono passati: tocca Aggiorna (serve la rete) per vedere i prossimi.")
                    } else {
                        RigaMessaggio(icona: "calendar", testo: "Nessun appuntamento in programma.")
                    }
                } else {
                    // portale non aggiornato o lettura non riuscita: meglio non dire «nessuno»
                    RigaMessaggio(icona: "calendar.badge.exclamationmark", testo: "Appuntamenti non disponibili in questo momento: li trovi nell'app sul telefono.")
                }
                Section {
                    Text("Per prenotare, spostare o disdire un appuntamento usa l'app sul telefono.")
                        .font(.caption2).foregroundStyle(.secondary)
                        .listRowBackground(Color.clear)
                }
                if let e = modello.errore {
                    Section { Text(e).font(.caption2).foregroundStyle(.red) }
                }
                RigaTornaAllaDieta(azione: tornaAllaDieta)
            }
        } else if modello.caricamento {
            ProgressView("Carico…")
        } else if let e = modello.errore {
            VistaMessaggio(icona: "wifi.exclamationmark", testo: e) { Task { await modello.carica() } }
        } else {
            ProgressView()
        }
    }
}

/// Il prossimo appuntamento, grande: giorno, ora, fra quanto, tipo e durata.
struct SchedaAppuntamento: View {
    let appuntamento: Appuntamento

    var body: some View {
        VStack(spacing: 3) {
            Text(Agenda.quando(appuntamento).uppercased())
                .font(.caption2.weight(.bold))
                .foregroundStyle(Colori.verde)
            Text(Agenda.giornoEsteso(appuntamento))
                .font(.headline)
                .multilineTextAlignment(.center)
                .lineLimit(2).minimumScaleFactor(0.8)
            Text("ore " + Agenda.ora(appuntamento))
                .font(.title2.weight(.bold))
                .foregroundStyle(Colori.verde)
            if let det = Agenda.dettaglio(appuntamento) {
                Text(det).font(.caption2).foregroundStyle(.secondary)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 4)
        .listRowBackground(Color.clear)
    }
}
