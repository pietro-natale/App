//
//  VistaPromemoria.swift — i promemoria dei pasti sull'orologio
//
//  Un interruttore e cinque orari (uno per pasto), scelti a mezz'ore. Gli avvisi dello
//  studio non si impostano qui: arrivano dall'iPhone e compaiono da soli sul polso.
//  Dalla .46 si apre dalla dieta (voce «Promemoria» in fondo): ‹ in alto a sinistra o
//  «Torna alla dieta» in fondo per tornarci.
//

import SwiftUI

struct VistaPromemoria: View {
    @ObservedObject var modello: ModelloOggi
    var tornaAllaDieta: () -> Void = {}
    @ObservedObject private var promemoria = Promemoria.condiviso

    // niente NavigationStack qui: il NavigationLink degli orari usa quello attorno alle pagine (VistaPrincipale)
    var body: some View {
        List {
            Section {
                Toggle(isOn: Binding(get: { promemoria.attivi }, set: { on in if on { promemoria.attiva() } else { promemoria.attivi = false } })) {
                    Text("Promemoria dei pasti")
                }
                .tint(Colori.verde)
                if promemoria.permessoNegato {
                    Text("Permesso negato: attivalo in Impostazioni → Notifiche → Studio Tramontano.")
                        .font(.caption2).foregroundStyle(.red)
                }
            } footer: {
                Text("All'ora scelta l'orologio ti ricorda il pasto del piano. Un pasto già segnato non viene ricordato. Funziona anche senza iPhone.")
                    .font(.caption2)
            }
            if promemoria.attivi {
                Section("Orari") {
                    ForEach(Promemoria.slot, id: \.self) { slot in
                        NavigationLink {
                            VistaOrario(slot: slot)
                        } label: {
                            HStack {
                                Text(Promemoria.etichette[slot] ?? slot).font(.footnote)
                                Spacer()
                                Text(Promemoria.testoOrario(promemoria.orario(slot))).font(.footnote.weight(.semibold)).foregroundStyle(Colori.verde)
                            }
                        }
                    }
                }
            }
            Section {
                Text("Gli avvisi dello studio (appuntamenti, risposte, nuova dieta) arrivano dall'iPhone e compaiono anche qui.")
                    .font(.caption2).foregroundStyle(.secondary)
            }
            RigaTornaAllaDieta(azione: tornaAllaDieta)
        }
        .navigationTitle("Promemoria")
    }
}

/// Scelta dell'orario di un pasto, a mezz'ore.
struct VistaOrario: View {
    let slot: String
    @ObservedObject private var promemoria = Promemoria.condiviso
    @Environment(\.dismiss) private var chiudi

    private let scelte: [Int] = stride(from: 5 * 60, through: 23 * 60 + 30, by: 30).map { $0 }

    var body: some View {
        List {
            ForEach(scelte, id: \.self) { m in
                Button {
                    promemoria.impostaOrario(slot, minuti: m)
                    chiudi()
                } label: {
                    HStack {
                        Text(Promemoria.testoOrario(m))
                        Spacer()
                        if m == promemoria.orario(slot) { Image(systemName: "checkmark").foregroundStyle(Colori.verde) }
                    }
                }
            }
        }
        .navigationTitle(Promemoria.etichette[slot] ?? slot)
    }
}
