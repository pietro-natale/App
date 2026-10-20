//
//  Cassaforte.swift — Studio Tramontano (app Apple Watch)
//  Lo stesso portachiavi c'e' anche nell'app iPhone (plugin-orologio): ogni dispositivo ha il suo.
//
//  Il token di sessione del portale e' una chiave d'accesso ai dati del paziente:
//  sta nel portachiavi del dispositivo (Keychain), non in UserDefaults, e resta
//  leggibile dopo il primo sblocco del dispositivo (serve quando l'app parte da sola).
//

import Foundation
import Security

// nonisolated: si usa anche fuori dal thread principale (Sessione); vedi la nota in Sessione.swift
nonisolated enum Cassaforte {
    private static let servizio = "it.tramontano.studio.pazienti.sessione"

    static func leggi(_ chiave: String) -> String? {
        let q: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: servizio,
            kSecAttrAccount as String: chiave,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        var out: AnyObject?
        guard SecItemCopyMatching(q as CFDictionary, &out) == errSecSuccess,
              let dati = out as? Data else { return nil }
        return String(data: dati, encoding: .utf8)
    }

    static func scrivi(_ chiave: String, _ valore: String) {
        cancella(chiave)
        guard let dati = valore.data(using: .utf8) else { return }
        let q: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: servizio,
            kSecAttrAccount as String: chiave,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlock,
            kSecValueData as String: dati
        ]
        _ = SecItemAdd(q as CFDictionary, nil)
    }

    static func cancella(_ chiave: String) {
        let q: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: servizio,
            kSecAttrAccount as String: chiave
        ]
        _ = SecItemDelete(q as CFDictionary)
    }
}
