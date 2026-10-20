//
//  Sessione.swift — l'accesso dell'orologio
//
//  Sul polso non si digita nulla: il token arriva dall'app sull'iPhone con
//  WatchConnectivity (contesto applicativo) e resta nel portachiavi dell'orologio.
//  E' una sessione PROPRIA dell'orologio (API: POST /api/mie/orologio, chiesta dall'app
//  del telefono): dura 180 giorni e si rinnova a ogni chiamata, vale solo per le tre
//  chiamate di ApiClient e non scade quando scade o si rinnova quella del telefono.
//  Cosi', una volta ricevuta, l'orologio non ha piu' bisogno dell'iPhone: con il Wi-Fi o
//  la rete cellulare chiama l'API da solo. Quando il paziente esce dall'app sul telefono
//  arriva un contesto con token vuoto e l'orologio dimentica l'accesso (e la sessione si
//  chiude anche sul server, se l'orologio in quel momento e' lontano).
//

import Foundation
import Combine
import WatchConnectivity

// @unchecked Sendable: i callback di WatchConnectivity arrivano su thread di sistema, ma ogni
// modifica alle proprieta' pubblicate passa dal thread principale (DispatchQueue.main).
// Versione .46: i target creati con Xcode 26 hanno «Default Actor Isolation = MainActor», che rende la
// classe @MainActor in silenzio. Per questo i metodi chiamati da WatchConnectivity su un thread di sistema
// (i tre del delegato, applica e le risposte di sendMessage) sono «nonisolated» / @Sendable: senza, con il
// linguaggio Swift 6 il primo callback farebbe chiudere l'app per il controllo di isolamento. Cosi' il
// codice e' corretto con ogni impostazione (verificato con Swift 6.2: modalita' 5 e 6, isolamento
// predefinito nessuno o MainActor). Non «nonisolated» sull'intera classe: con @Published non e' ammesso.
final class Sessione: NSObject, ObservableObject, WCSessionDelegate, @unchecked Sendable {
    static let condivisa = Sessione()

    /// Indirizzo dell'API se il telefono non l'ha ancora comunicato (e' lo stesso di web/src/api.js).
    static let apiPredefinita = "https://portale-studio-tramontano.soluzionibwg.workers.dev"

    @Published private(set) var token: String = Cassaforte.leggi("token") ?? ""
    @Published private(set) var apiBase: String = Cassaforte.leggi("api") ?? Sessione.apiPredefinita
    @Published private(set) var nome: String = UserDefaults.standard.string(forKey: "nome") ?? ""
    @Published private(set) var telefonoRaggiungibile = false
    @Published private(set) var richiestaInCorso = false

    /// Un token che il server ha gia' rifiutato (401): se il telefono lo rimanda uguale non si
    /// riprova all'infinito, si aspetta che il paziente rientri e ne arrivi uno nuovo.
    private var tokenRifiutato: String? = UserDefaults.standard.string(forKey: "tokenRifiutato")

    var haAccesso: Bool { !token.isEmpty }

    private override init() {
        super.init()
        guard WCSession.isSupported() else { return }
        WCSession.default.delegate = self
        WCSession.default.activate()
    }

    /// Applica un contesto arrivato dal telefono (token vuoto = uscita dal portale). Da qualunque thread:
    /// legge solo il dizionario, il resto lo fa sul thread principale.
    nonisolated private func applica(_ c: [String: Any]) {
        let t = (c["token"] as? String) ?? ""
        let api = (c["api"] as? String) ?? ""
        let n = (c["nome"] as? String) ?? ""
        DispatchQueue.main.async {
            if !t.isEmpty, t == self.tokenRifiutato { return }   // stesso token gia' scaduto: si resta senza accesso
            if t.isEmpty {
                // anche se il portachiavi non riuscisse a cancellarlo, quel token non va piu' riletto
                if !self.token.isEmpty { self.tokenRifiutato = self.token; UserDefaults.standard.set(self.token, forKey: "tokenRifiutato") }
                Cassaforte.cancella("token"); self.token = ""
                UserDefaults.standard.removeObject(forKey: "nome"); self.nome = ""
                Archivio.cancellaTutto(); Promemoria.condiviso.cancellaTutti()   // uscita: via dati salvati e promemoria
            } else {
                // un altro paziente sullo stesso iPhone mentre l'orologio era lontano (arriva solo l'ultimo
                // accesso, non l'uscita del primo): via giornata, coda e promemoria del paziente di prima
                if !n.isEmpty, !self.nome.isEmpty, n != self.nome {
                    Archivio.cancellaTutto(); Promemoria.condiviso.cancellaTutti()
                }
                self.tokenRifiutato = nil; UserDefaults.standard.removeObject(forKey: "tokenRifiutato")
                Cassaforte.scrivi("token", t); self.token = t
                if !n.isEmpty { UserDefaults.standard.set(n, forKey: "nome"); self.nome = n }
            }
            if !api.isEmpty { Cassaforte.scrivi("api", api); self.apiBase = api }
        }
    }

    /// Chiede l'accesso all'iPhone: serve la prima volta, o dopo un'uscita.
    /// Prima si usa quello che il sistema ha gia' consegnato, poi si manda un messaggio
    /// (che arriva solo se il telefono e' raggiungibile, e sveglia l'app anche in sottofondo).
    func chiediAlTelefono() {
        if ricaricaDalPortachiavi() { return }
        guard WCSession.isSupported() else { return }
        let s = WCSession.default
        guard s.activationState == .activated else { s.activate(); return }
        if !s.receivedApplicationContext.isEmpty { applica(s.receivedApplicationContext) }
        guard s.isReachable else { return }
        richiestaInCorso = true
        // risposta ed errore arrivano su un thread di sistema: chiusure @Sendable (non legate al thread principale)
        s.sendMessage(["chiedi": "accesso"], replyHandler: { @Sendable risposta in
            DispatchQueue.main.async { self.richiestaInCorso = false }
            if !risposta.isEmpty { self.applica(risposta) }
        }, errorHandler: { @Sendable _ in
            DispatchQueue.main.async { self.richiestaInCorso = false }
        })
    }

    /// Dopo un 401 dall'API: la sessione sul server non vale piu' (scaduta o chiusa dallo studio). Conta solo
    /// se il token rifiutato ("usato" dalla richiesta) e' ancora quello in uso: se intanto dal telefono ne e'
    /// arrivato uno nuovo, quello resta valido. Ritorna true se l'accesso e' stato tolto. Dal thread principale.
    @discardableResult
    func scaduta(_ usato: String) -> Bool {
        let vecchio = token
        guard !vecchio.isEmpty, usato == vecchio else { return false }
        Cassaforte.cancella("token")
        tokenRifiutato = vecchio; UserDefaults.standard.set(vecchio, forKey: "tokenRifiutato")
        token = ""
        return true
    }

    /// Rilegge l'accesso dal portachiavi se in memoria non c'e': all'avvio il portachiavi puo' non essere
    /// leggibile (app partita in sottofondo prima del primo sblocco dopo un riavvio) e senza questo l'orologio
    /// resterebbe senza accesso finche' l'app non riparte. Ritorna true se l'accesso e' stato ritrovato.
    /// Dal thread principale.
    @discardableResult
    func ricaricaDalPortachiavi() -> Bool {
        guard token.isEmpty, let t = Cassaforte.leggi("token"), !t.isEmpty, t != tokenRifiutato else { return false }
        token = t
        if let a = Cassaforte.leggi("api"), !a.isEmpty { apiBase = a }
        return true
    }

    // MARK: - WCSessionDelegate (watchOS)

    // si legge isReachable qui e al thread principale passa solo il Bool (WCSession non e' Sendable)
    nonisolated func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        let raggiungibile = session.isReachable
        DispatchQueue.main.async { self.telefonoRaggiungibile = raggiungibile }
        // l'ultimo contesto consegnato dal sistema e' lo stato piu' recente noto del telefono
        if activationState == .activated, !session.receivedApplicationContext.isEmpty {
            applica(session.receivedApplicationContext)
        }
    }

    nonisolated func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) {
        applica(applicationContext)
    }

    nonisolated func sessionReachabilityDidChange(_ session: WCSession) {
        let raggiungibile = session.isReachable
        DispatchQueue.main.async { self.telefonoRaggiungibile = raggiungibile }
    }
}
