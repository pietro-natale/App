//
//  DelegatoWatch.swift — ciclo di vita dell'app sull'orologio
//
//  Serve per due cose che SwiftUI da solo non copre:
//   - l'AGGIORNAMENTO IN SOTTOFONDO: watchOS risveglia l'app (quando lo ritiene
//     opportuno, in genere qualche volta al giorno) e qui si scarica la giornata e si
//     ripianificano i promemoria, cosi' restano giusti anche se l'app non viene aperta;
//   - le NOTIFICHE mostrate mentre l'app e' aperta (altrimenti il sistema le tace).
//

import Foundation
import WatchKit
import UserNotifications
import WatchConnectivity

final class DelegatoWatch: NSObject, WKApplicationDelegate, UNUserNotificationCenterDelegate {

    func applicationDidFinishLaunching() {
        UNUserNotificationCenter.current().delegate = self
        Aggiornamento.programma()
    }

    func handle(_ backgroundTasks: Set<WKRefreshBackgroundTask>) {
        for task in backgroundTasks {
            if let aggiorna = task as? WKApplicationRefreshBackgroundTask {
                // watchOS da' pochi secondi a un compito in sottofondo e chiude l'app se non finisce in tempo:
                // allo scadere si interrompe il caricamento (le richieste in corso si fermano subito, la
                // giornata salvata resta) e il compito si chiude comunque
                Aggiornamento.programma()
                let lavoro = Task { @MainActor in await ModelloOggi.condiviso.aggiornaInSottofondo() }
                aggiorna.expirationHandler = { @Sendable in lavoro.cancel() }
                Task { @MainActor in
                    await lavoro.value
                    aggiorna.setTaskCompletedWithSnapshot(false)
                }
            } else if let collegamento = task as? WKWatchConnectivityRefreshBackgroundTask {
                // arriva qualcosa dall'iPhone (nuovo accesso, uscita): il compito resta aperto finche'
                // WatchConnectivity non ha consegnato tutto, al massimo qualche secondo
                _ = Sessione.condivisa
                Task { @MainActor in
                    var n = 0
                    while n < 16, WCSession.default.activationState != .activated || WCSession.default.hasContentPending {
                        try? await Task.sleep(nanoseconds: 500_000_000)
                        n += 1
                    }
                    collegamento.setTaskCompletedWithSnapshot(false)
                }
            } else {
                task.setTaskCompletedWithSnapshot(false)
            }
        }
    }

    // un promemoria che scatta mentre l'app e' aperta si mostra lo stesso.
    // nonisolated: UserNotifications chiama questi metodi dalla sua coda, non dal thread principale
    nonisolated func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification,
                                            withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.banner, .sound])
    }

    // toccata una notifica: l'app si apre sulla giornata (gia' aperta per costruzione)
    nonisolated func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse,
                                            withCompletionHandler completionHandler: @escaping () -> Void) {
        Task { @MainActor in await ModelloOggi.condiviso.carica(silenzioso: true) }
        completionHandler()
    }
}
