//
//  VistaPrincipale.swift — la dieta di oggi e, da li', la spesa, l'appuntamento e i promemoria
//
//  Versione .46 (richiesta dello studio: «dalla lista della spesa non si capisce come tornare alla dieta»): niente
//  piu' pagine verticali da scorrere con la corona (si confondevano con lo scorrimento degli elenchi lunghi). La
//  schermata principale e' la dieta di oggi; Lista della spesa, Appuntamento e Promemoria si aprono dalle voci in
//  fondo alla dieta (la spesa anche dal pulsante 🛒 in basso a sinistra) e hanno in alto a sinistra il pulsante
//  indietro di watchOS (‹), piu' «Torna alla dieta» in fondo e il pulsante 🍴 in basso a sinistra.
//  Senza accesso si vede una sola schermata che spiega come riceverlo dall'iPhone.
//
//  NAVIGAZIONE: UN SOLO NavigationStack. Prima della .44 ogni pagina aveva il proprio NavigationStack dentro un
//  TabView verticale: watchOS si trovava con piu' barre di navigazione annidate e l'app si chiudeva appena arrivava
//  l'accesso ("Layout requested for visible navigation bar ... nest wrapped navigation controllers"). Le schermate
//  danno solo il titolo (.navigationTitle) e i pulsanti in basso (.toolbar, posizione .bottomBar: quelle in alto,
//  .topBarTrailing, su watchOS 10 e 11 facevano chiudere l'app in alcune combinazioni); le schermate si aprono con
//  NavigationLink(value:) / il percorso qui sotto, gli orari dei promemoria con un NavigationLink sullo stesso stack.
//

import SwiftUI

struct VistaPrincipale: View {
    @EnvironmentObject private var sessione: Sessione
    @StateObject private var modello = ModelloOggi.condiviso
    @Environment(\.scenePhase) private var fase
    /// le schermate aperte sopra la dieta ([] = la dieta)
    @State private var percorso: [Destinazione] = []

    var body: some View {
        Group {
            if sessione.haAccesso {
                NavigationStack(path: $percorso) {
                    VistaPasti(modello: modello, vai: { percorso = [$0] })
                        .navigationDestination(for: Destinazione.self) { destinazione in
                            switch destinazione {
                            case .spesa: VistaSpesa(modello: modello, tornaAllaDieta: { percorso = [] })
                            case .appuntamento: VistaAppuntamento(modello: modello, tornaAllaDieta: { percorso = [] })
                            case .promemoria: VistaPromemoria(modello: modello, tornaAllaDieta: { percorso = [] })
                            }
                        }
                }
            } else {
                VistaSenzaAccesso()
            }
        }
        // si ricarica quando cambia il token (primo accesso, uscita, rientro)
        .task(id: sessione.token) { await modello.carica() }
        // con un accesso nuovo (o all'uscita) si riparte dalla dieta
        .onChange(of: sessione.token) { _, _ in percorso = [] }
        // e ogni volta che l'app torna sul polso, senza rotella se c'e' gia' qualcosa a schermo
        .onChange(of: fase) { _, nuova in
            guard nuova == .active else { return }
            // accesso non leggibile all'avvio (prima del primo sblocco): se ora c'e', il cambio di token
            // fa ripartire il .task qui sopra; altrimenti si aggiorna la giornata
            if !sessione.ricaricaDalPortachiavi() { Task { await modello.carica(silenzioso: true) } }
        }
    }
}

/// Niente token: l'accesso lo da' l'iPhone (una volta sola: poi l'orologio ha una sessione sua).
struct VistaSenzaAccesso: View {
    @EnvironmentObject private var sessione: Sessione

    var body: some View {
        ScrollView {
            VStack(spacing: 10) {
                Image(systemName: "iphone.and.arrow.forward")
                    .font(.system(size: 30))
                    .foregroundStyle(Colori.verde)
                Text("Studio Tramontano")
                    .font(.headline)
                Text("Apri l'app sull'iPhone e fai l'accesso: l'orologio lo riceve da solo.")
                    .font(.footnote)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.secondary)
                Text("Dopo funziona anche senza iPhone, con il Wi-Fi o la rete cellulare dell'orologio.")
                    .font(.caption2)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.secondary)
                // a chi e' riservata l'app: lo stesso testo della pagina di accesso (web/src/riservato.js)
                Text("Accesso riservato ai pazienti dello Studio Tramontano che hanno già fatto la prima visita e sono stati abilitati dallo studio.")
                    .font(.caption2)
                    .multilineTextAlignment(.center)
                Text("Non sei ancora paziente? Prenota la prima visita su WhatsApp: 379 381 3252")
                    .font(.caption2.weight(.semibold))
                    .foregroundStyle(Colori.verde)
                    .multilineTextAlignment(.center)
                Button {
                    sessione.chiediAlTelefono()
                } label: {
                    if sessione.richiestaInCorso { ProgressView() } else { Text("Chiedi all'iPhone") }
                }
                .tint(Colori.verde)
                .disabled(sessione.richiestaInCorso)
                if !sessione.telefonoRaggiungibile {
                    Text("iPhone non raggiungibile in questo momento.")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                        .multilineTextAlignment(.center)
                }
            }
            .padding(.horizontal, 4)
        }
        .onAppear { sessione.chiediAlTelefono() }
    }
}

/// Pulsante in basso a destra delle schermate: riscarica la giornata.
struct BottoneAggiorna: View {
    @ObservedObject var modello: ModelloOggi
    var body: some View {
        Button { Task { await modello.carica() } } label: {
            Label("Aggiorna", systemImage: "arrow.clockwise")
        }
        .disabled(modello.caricamento)
    }
}

/// Pulsante in basso a sinistra delle schermate aperte dalla dieta: riporta alla dieta.
struct BottoneDieta: View {
    let azione: () -> Void
    var body: some View {
        Button(action: azione) {
            Label("Torna alla dieta", systemImage: "fork.knife")
        }
    }
}

/// «Torna alla dieta», in fondo agli elenchi delle schermate aperte dalla dieta: per chi non vede il ‹ in alto.
struct RigaTornaAllaDieta: View {
    let azione: () -> Void
    var body: some View {
        Section {
            Button(action: azione) {
                Label("Torna alla dieta", systemImage: "fork.knife")
                    .font(.footnote.weight(.semibold))
            }
            .foregroundStyle(Colori.verde)
        }
    }
}

/// Un messaggio dentro un elenco (niente piano, giorno libero, nessun appuntamento...): con l'elenco attorno
/// restano raggiungibili le altre voci.
struct RigaMessaggio: View {
    let icona: String
    let testo: String
    var body: some View {
        VStack(spacing: 6) {
            Image(systemName: icona).font(.title3).foregroundStyle(Colori.verde)
            Text(testo).font(.footnote).multilineTextAlignment(.center).foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .listRowBackground(Color.clear)
    }
}

/// Riga gialla in testa agli elenchi quando si mostrano dati salvati (senza rete).
struct NotaFuoriLinea: View {
    @ObservedObject var modello: ModelloOggi
    var body: some View {
        if let n = modello.notaFuoriLinea {
            Text(n).font(.caption2).foregroundStyle(Colori.ambra)
                .listRowBackground(Color.clear)
        }
    }
}

/// Messaggio a tutto schermo (niente piano, giorno libero, errore...).
struct VistaMessaggio: View {
    let icona: String
    let testo: String
    var azione: (() -> Void)? = nil
    var etichettaAzione = "Riprova"

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icona).font(.system(size: 28)).foregroundStyle(Colori.verde)
            Text(testo).font(.footnote).multilineTextAlignment(.center).foregroundStyle(.secondary)
            if let a = azione { Button(etichettaAzione, action: a).tint(Colori.verde) }
        }
        .padding(.horizontal, 6)
    }
}

enum Colori {
    static let verde = Color(red: 47 / 255, green: 107 / 255, blue: 87 / 255)     // #2F6B57, il verde dello studio
    static let ambra = Color(red: 201 / 255, green: 138 / 255, blue: 44 / 255)    // #C98A2C, "saltato"
}
