//
//  StudioTramontanoWatchApp.swift — app Apple Watch dello Studio Tramontano
//
//  Versione ridotta dell'area pazienti: i pasti di oggi, la lista della spesa, il prossimo
//  appuntamento e i promemoria dei pasti. Funziona anche senza rete (ultimi dati salvati, modifiche
//  in coda). Non si fa l'accesso sul polso: l'accesso arriva una volta dall'app
//  sull'iPhone (vedi Sessione.swift) ed e' una sessione propria dell'orologio, che si
//  rinnova a ogni uso: da li' in poi l'orologio chiama l'API da solo, anche con l'iPhone
//  lontano o spento, purche' abbia il Wi-Fi o la rete cellulare. I dati arrivano da una
//  sola chiamata all'API (/api/mie/oggi).
//
//  watchOS 10 o successivo. Target da creare in Xcode come "Watch App for iOS App"
//  (istruzioni nel LEGGIMI.md di questa cartella).
//

import SwiftUI

@main
struct StudioTramontanoWatchApp: App {
    @WKApplicationDelegateAdaptor(DelegatoWatch.self) private var delegato
    @StateObject private var sessione = Sessione.condivisa

    var body: some Scene {
        WindowGroup {
            VistaPrincipale()
                .environmentObject(sessione)
        }
    }
}
