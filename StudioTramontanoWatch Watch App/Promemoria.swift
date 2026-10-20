//
//  Promemoria.swift — avvisi dei pasti direttamente sull'orologio
//
//  Due tipi di notifiche arrivano al polso:
//   1. quelle dello studio (appuntamento confermato, risposta della dottoressa, nuova
//      dieta): le manda il Worker all'iPhone e watchOS le rispecchia sull'orologio
//      quando l'iPhone e' bloccato — nessun codice qui;
//   2. i PROMEMORIA DEI PASTI, che invece nascono qui: notifiche locali programmate
//      dall'app con l'orario scelto dal paziente e il testo del pasto del piano.
//      Funzionano anche senza rete e senza iPhone, perche' si programmano con i dati
//      di oggi e dei 3 giorni dopo gia' scaricati (l'aggiornamento in sottofondo di
//      watchOS e' raro senza una complicazione sul quadrante: cosi' i promemoria
//      continuano anche se l'app non viene aperta per qualche giorno). Un pasto gia'
//      segnato nel diario non viene ricordato.
//

import Foundation
import Combine
import UserNotifications
#if canImport(WatchKit)
import WatchKit
#endif

@MainActor
final class Promemoria: ObservableObject {
    static let condiviso = Promemoria()

    static let slot = ["colazione", "spuntino_m", "pranzo", "spuntino_p", "cena"]
    static let etichette = ["colazione": "Colazione", "spuntino_m": "Spuntino del mattino", "pranzo": "Pranzo",
                            "spuntino_p": "Spuntino del pomeriggio", "cena": "Cena"]
    /// Orari predefiniti, in minuti dalla mezzanotte.
    static let orariPredefiniti = ["colazione": 8 * 60, "spuntino_m": 10 * 60 + 30, "pranzo": 13 * 60,
                                   "spuntino_p": 16 * 60 + 30, "cena": 20 * 60]

    @Published var attivi: Bool = UserDefaults.standard.bool(forKey: "promemoria.attivi") {
        didSet { UserDefaults.standard.set(attivi, forKey: "promemoria.attivi"); ripianifica() }
    }
    @Published var permessoNegato = false

    private var ultimiDati: Oggi?

    nonisolated init() {}

    func orario(_ slot: String) -> Int {
        let v = UserDefaults.standard.object(forKey: "promemoria.orario." + slot) as? Int
        return v ?? (Promemoria.orariPredefiniti[slot] ?? 12 * 60)
    }

    func impostaOrario(_ slot: String, minuti: Int) {
        UserDefaults.standard.set(minuti, forKey: "promemoria.orario." + slot)
        objectWillChange.send()
        ripianifica()
    }

    static func testoOrario(_ minuti: Int) -> String { String(format: "%d:%02d", minuti / 60, minuti % 60) }

    /// Chiede il permesso (una volta) e programma; da chiamare quando il paziente accende l'interruttore.
    func attiva() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { ok, _ in
            Task { @MainActor in
                self.permessoNegato = !ok
                self.attivi = ok
            }
        }
    }

    /// Ripianifica con gli ultimi dati noti (cambio di orario o di interruttore).
    private func ripianifica() {
        if let d = ultimiDati { pianifica(con: d) } else if let s = Archivio.leggi() { pianifica(con: s.dati) }
    }

    /// Un promemoria da programmare, fatto solo di dati Sendable. Versione .46: la chiusura di
    /// getPendingNotificationRequests e' @Sendable (gira fuori dal main thread) e le classi di UserNotifications
    /// non sono Sendable: prima vi si catturavano il centro notifiche e le richieste gia' pronte (3 avvisi di Xcode
    /// in Promemoria.swift). Ora vi entrano solo questi dati; centro e richieste si prendono e si creano li' dentro.
    private struct Avviso: Sendable {
        let id: String
        let titolo: String
        let testo: String
        let quando: DateComponents
    }

    /// Programma i promemoria per i pasti di oggi non ancora passati e per quelli dei giorni dopo.
    func pianifica(con dati: Oggi) {
        ultimiDati = dati
        let nuovi: [Avviso] = attivi
            ? avvisi(per: dati.pasti, data: dati.data, soloFuturi: true)
                + dati.giorniDopo.flatMap { avvisi(per: $0.pasti, data: $0.data, soloFuturi: false) }
            : []
        // tutti gli identificativi possibili di questi giorni: "add" e' asincrono, e un promemoria appena
        // aggiunto da un giro precedente potrebbe non comparire ancora fra quelli in attesa
        let giorni = [dati.data] + dati.giorniDopo.map { $0.data }
        let previsti = giorni.flatMap { g in Promemoria.slot.map { "pasto-\(g)-\($0)" } }
        // prima via le vecchie, poi le nuove: nello stesso passaggio, per non cancellare quelle appena aggiunte
        UNUserNotificationCenter.current().getPendingNotificationRequests { richieste in
            let centro = UNUserNotificationCenter.current()
            let vecchie = richieste.map(\.identifier).filter { $0.hasPrefix("pasto-") }
            centro.removePendingNotificationRequests(withIdentifiers: vecchie + previsti)
            for a in nuovi {
                let contenuto = UNMutableNotificationContent()
                contenuto.title = a.titolo
                contenuto.body = a.testo
                contenuto.sound = .default
                contenuto.threadIdentifier = "pasti"
                let trigger = UNCalendarNotificationTrigger(dateMatching: a.quando, repeats: false)
                centro.add(UNNotificationRequest(identifier: a.id, content: contenuto, trigger: trigger))
            }
        }
    }

    private func avvisi(per pasti: [Pasto], data: String, soloFuturi: Bool) -> [Avviso] {
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_US_POSIX"); f.calendar = Calendar(identifier: .gregorian)
        f.dateFormat = "yyyy-MM-dd"; f.timeZone = TimeZone.current
        guard let giorno = f.date(from: data) else { return [] }
        var out: [Avviso] = []
        for p in pasti where p.esito == nil {
            let minuti = orario(p.pasto)
            guard let quando = Calendar.current.date(bySettingHour: minuti / 60, minute: minuti % 60, second: 0, of: giorno) else { continue }
            if soloFuturi && quando <= Date() { continue }
            out.append(Avviso(id: "pasto-\(data)-\(p.pasto)",
                              titolo: Promemoria.etichette[p.pasto] ?? p.etichetta,
                              testo: p.testo + (p.kcal.map { " · \($0) kcal" } ?? ""),
                              quando: Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: quando)))
        }
        return out
    }

    /// All'uscita dal portale: via tutti i promemoria programmati.
    func cancellaTutti() {
        UNUserNotificationCenter.current().getPendingNotificationRequests { richieste in
            UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: richieste.map(\.identifier).filter { $0.hasPrefix("pasto-") })
        }
    }
}

/// Aggiornamento in sottofondo: si chiede a watchOS di risvegliare l'app ogni qualche ora
/// per scaricare la giornata e ripianificare i promemoria (vedi DelegatoWatch).
enum Aggiornamento {
    static func programma(fra secondi: TimeInterval = 4 * 3600) {
        #if os(watchOS)
        // @Sendable: watchOS chiama la conferma da un suo thread (cosi' la chiusura non e' legata al thread principale)
        WKApplication.shared().scheduleBackgroundRefresh(withPreferredDate: Date().addingTimeInterval(secondi), userInfo: nil) { @Sendable _ in }
        #endif
    }
}

