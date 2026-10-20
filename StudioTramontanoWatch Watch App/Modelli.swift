//
//  Modelli.swift — la risposta di GET /api/mie/oggi, cosi' com'e'
//
//  LETTURA TOLLERANTE, come quella dell'app Wear OS (org.json): un numero dove ci si aspetta un
//  testo (l'id del piano puo' essere numerico), un numero con la virgola dove ci si aspetta un
//  intero, un campo mancante o null, un elemento malformato in un elenco NON fanno piu' fallire
//  tutta la giornata ("Risposta non leggibile"): si legge cio' che c'e'. Prima bastava un tipo
//  diverso in un solo campo per lasciare l'orologio senza pasti, spesa e promemoria.
//  La scrittura (Archivio, giornata salvata per l'uso senza rete) resta quella standard.
//

import Foundation

struct Oggi: Codable {
    var data: String                  // "2026-10-07" (fuso di Roma, deciso dal server)
    var nome: String?
    var piano: String?
    var giorno: GiornoPiano?
    var pasti: [Pasto]
    var kcal: Int?
    var spesa: Spesa?
    var spesaSettimana: Spesa?        // la lista della settimana del piano (API dalla .46; prima: assente)
    var domani: Domani?               // il giorno dopo (API di prima della .44)
    var prossimi: [Domani]?           // i 3 giorni dopo oggi (API dalla .44): promemoria anche senza aprire l'app
    /// i prossimi appuntamenti allo studio (API dalla .46). nil: il portale non li manda (non aggiornato, o non ha
    /// potuto leggerli); [] nessuno in programma
    var appuntamenti: [Appuntamento]?

    enum CodingKeys: String, CodingKey { case data, nome, piano, giorno, pasti, kcal, spesa, spesaSettimana, domani, prossimi, appuntamenti }

    /// I giorni dopo oggi per i promemoria: "prossimi" se l'API li manda, altrimenti solo domani.
    var giorniDopo: [Domani] {
        if let p = prossimi, !p.isEmpty { return p }
        if let d = domani { return [d] }
        return []
    }

    /// Gli appuntamenti non ancora finiti, dal piu' vicino (nil se il portale non li manda). Si ricalcola a ogni
    /// uso: anche con la giornata salvata (senza rete) quelli passati spariscono da soli.
    var prossimiAppuntamenti: [Appuntamento]? { appuntamenti.map { Agenda.prossimi($0) } }

    /// Gli appuntamenti salvati sono tutti passati (giornata vecchia, senza rete): non si sa se ce ne sono altri
    /// (il portale ne manda al massimo 3), quindi non si dice «nessuno» ma che vanno aggiornati.
    var appuntamentiDaAggiornare: Bool {
        guard let tutti = appuntamenti, !tutti.isEmpty else { return false }
        return (prossimiAppuntamenti ?? []).isEmpty
    }

    /// Data di oggi in forma leggibile ("mercoledì 7 ottobre"), nel fuso di Roma come la data del server.
    var dataEstesa: String {
        let roma = TimeZone(identifier: "Europe/Rome") ?? TimeZone.current
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_US_POSIX"); f.calendar = Calendar(identifier: .gregorian)
        f.timeZone = roma; f.dateFormat = "yyyy-MM-dd"
        guard let d = f.date(from: data) else { return data }
        let g = DateFormatter()
        g.locale = Locale(identifier: "it_IT"); g.timeZone = roma; g.dateFormat = "EEEE d MMMM"
        return g.string(from: d)
    }
}

/// Un giorno dopo oggi secondo il piano: niente stato del diario, solo i pasti.
struct Domani: Codable {
    var data: String
    var giorno: GiornoPiano?
    var pasti: [Pasto]

    enum CodingKeys: String, CodingKey { case data, giorno, pasti }
}

struct GiornoPiano: Codable {
    var indice: Int
    var label: String
    var settimana: Int?
    var libero: Bool

    enum CodingKeys: String, CodingKey { case indice, label, settimana, libero }
}

struct Pasto: Codable, Identifiable {
    var pasto: String                 // colazione, spuntino_m, pranzo, spuntino_p, cena
    var etichetta: String
    var testo: String
    var kcal: Int?
    var originale: String?            // il pasto del piano, quando e' in uso un'alternativa
    var alternativa: Int?             // quale alternativa (0 = la prima) e' stata scelta sul telefono
    var alternative: [Alternativa]?
    var esito: String?                // "fatto", "saltato" o nulla

    enum CodingKeys: String, CodingKey { case pasto, etichetta, testo, kcal, originale, alternativa, alternative, esito }

    var id: String { pasto }
    var fatto: Bool { esito == "fatto" }
    var saltato: Bool { esito == "saltato" }
    var principale: Bool { pasto == "pranzo" || pasto == "cena" }
}

struct Alternativa: Codable {
    var testo: String
    var kcal: Int?
    var prot: Int?

    enum CodingKeys: String, CodingKey { case testo, kcal, prot }
}

struct Spesa: Codable {
    var piano: String?
    var chiave: Int?                  // la "settimana" delle spunte: negativa per un giorno, il numero per una settimana, 0 per tutto
    var indice: Int?
    var giorno: String?               // "Martedì" per la lista di un giorno; "settimana 2" / "tutto il piano" per quella della settimana
    var settimana: Int?               // solo nella lista della settimana
    var reparti: [Reparto]?
    var nonRiconosciuti: [String]?
    var errore: String?

    enum CodingKeys: String, CodingKey { case piano, chiave, indice, giorno, settimana, reparti, nonRiconosciuti, errore }

    var voci: [Voce] { (reparti ?? []).flatMap { $0.voci } }
    var daPrendere: Int { voci.filter { !$0.preso }.count }
}

struct Reparto: Codable, Identifiable {
    var nome: String
    var voci: [Voce]

    enum CodingKeys: String, CodingKey { case nome, voci }

    var id: String { nome }
}

struct Voce: Codable, Identifiable {
    var alimento: String
    var quantita: String?
    var preso: Bool

    enum CodingKeys: String, CodingKey { case alimento, quantita, preso }

    var id: String { alimento }
}

/// Un appuntamento allo studio (API dalla .46): solo giorno, ora, durata e tipo.
struct Appuntamento: Codable, Identifiable, Equatable {
    var data: String                  // "2026-10-16": il giorno, all'ora di Roma come lo studio
    var inizio: Int                   // minuti dalla mezzanotte: 570 = 9:30
    var durata: Int?                  // minuti
    var tipo: String?                 // "controllo", "prima visita"

    enum CodingKeys: String, CodingKey { case data, inizio, durata, tipo }

    var id: String { data + "-" + String(inizio) }
}

/// Calcoli e testi degli appuntamenti, sempre all'ora di Roma (quella dello studio), anche con l'orologio in viaggio.
enum Agenda {
    static let roma = TimeZone(identifier: "Europe/Rome") ?? TimeZone.current
    static var calendario: Calendar { var c = Calendar(identifier: .gregorian); c.timeZone = roma; return c }

    /// Quando comincia (nil se il giorno non si legge). Con giorno e ora, non sommando minuti: giusto anche nei
    /// giorni del cambio dell'ora.
    static func inizio(_ a: Appuntamento) -> Date? {
        let p = a.data.split(separator: "-").compactMap { Int($0) }
        guard p.count == 3, (0..<24 * 60).contains(a.inizio) else { return nil }
        var dc = DateComponents()
        dc.year = p[0]; dc.month = p[1]; dc.day = p[2]; dc.hour = a.inizio / 60; dc.minute = a.inizio % 60
        return calendario.date(from: dc)
    }

    /// Quando finisce: la durata, almeno 10 minuti.
    static func fine(_ a: Appuntamento) -> Date? { inizio(a)?.addingTimeInterval(Double(max(a.durata ?? 0, 10)) * 60) }

    /// Quelli non ancora finiti, dal piu' vicino.
    static func prossimi(_ elenco: [Appuntamento], adesso: Date = Date()) -> [Appuntamento] {
        elenco.compactMap { a -> (Appuntamento, Date)? in
            guard let i = inizio(a), let f = fine(a), f > adesso else { return nil }
            return (a, i)
        }
        .sorted { $0.1 < $1.1 }
        .map { $0.0 }
    }

    /// Fra quanti giorni (0 oggi, 1 domani), con il calendario di Roma.
    static func giorniDa(_ a: Appuntamento, adesso: Date = Date()) -> Int? {
        guard let i = inizio(a) else { return nil }
        let cal = calendario
        return cal.dateComponents([.day], from: cal.startOfDay(for: adesso), to: cal.startOfDay(for: i)).day
    }

    static func inCorso(_ a: Appuntamento, adesso: Date = Date()) -> Bool {
        guard let i = inizio(a), let f = fine(a) else { return false }
        return i <= adesso && adesso < f
    }

    /// "in corso", "oggi", "domani", "tra 3 giorni"
    static func quando(_ a: Appuntamento, adesso: Date = Date()) -> String {
        if inCorso(a, adesso: adesso) { return "in corso" }
        switch giorniDa(a, adesso: adesso) ?? 0 {
        case ...0: return "oggi"
        case 1: return "domani"
        case let n: return "tra \(n) giorni"
        }
    }

    private static func formato(_ schema: String) -> DateFormatter {
        let f = DateFormatter()
        f.locale = Locale(identifier: "it_IT"); f.calendar = calendario; f.timeZone = roma; f.dateFormat = schema
        return f
    }

    /// "Giovedì 16 ottobre"
    static func giornoEsteso(_ a: Appuntamento) -> String {
        guard let i = inizio(a) else { return a.data }
        let s = formato("EEEE d MMMM").string(from: i)
        return s.prefix(1).uppercased() + s.dropFirst()
    }

    /// "gio 16 ott"
    static func giornoBreve(_ a: Appuntamento) -> String {
        guard let i = inizio(a) else { return a.data }
        return formato("EEE d MMM").string(from: i)
    }

    /// "9:30"
    static func ora(_ a: Appuntamento) -> String { String(format: "%d:%02d", a.inizio / 60, a.inizio % 60) }

    /// "Controllo · 10 minuti" (nil se non si sa nulla)
    static func dettaglio(_ a: Appuntamento) -> String? {
        var parti: [String] = []
        if let t = a.tipo, !t.isEmpty { parti.append(t.prefix(1).uppercased() + t.dropFirst()) }
        if let d = a.durata, d > 0 { parti.append("\(d) minuti") }
        return parti.isEmpty ? nil : parti.joined(separator: " · ")
    }
}

// MARK: - lettura tollerante
// Negli extension, cosi' restano anche gli inizializzatori "membro per membro" delle struct.

extension Oggi {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        // senza la data non e' una giornata (risposta d'errore, proxy...): non deve sostituire quella salvata
        // ne' cancellare i promemoria
        guard let d = c.testo(.data), !d.isEmpty else {
            throw DecodingError.dataCorruptedError(forKey: .data, in: c, debugDescription: "giornata senza data")
        }
        data = d
        nome = c.testo(.nome)
        piano = c.testo(.piano)
        giorno = c.oggetto(GiornoPiano.self, .giorno)
        pasti = c.elenco(Pasto.self, .pasti)
        kcal = c.intero(.kcal)
        spesa = c.oggetto(Spesa.self, .spesa)
        spesaSettimana = c.oggetto(Spesa.self, .spesaSettimana)
        domani = c.oggetto(Domani.self, .domani)
        prossimi = c.contains(.prossimi) ? c.elenco(Domani.self, .prossimi) : nil
        // assente o null: non si sa (portale non aggiornato, lettura non riuscita); un elenco, anche vuoto: si sa
        if let righe = try? c.decodeIfPresent([Tollerante<Appuntamento>].self, forKey: .appuntamenti) {
            appuntamenti = righe.compactMap { $0.valore }
        } else {
            appuntamenti = nil
        }
    }
}

extension Appuntamento {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        guard let d = c.testo(.data), d.count >= 10 else {
            throw DecodingError.dataCorruptedError(forKey: .data, in: c, debugDescription: "appuntamento senza giorno")
        }
        data = String(d.prefix(10))
        inizio = c.intero(.inizio) ?? 0
        durata = c.intero(.durata)
        tipo = c.testo(.tipo)
    }
}

extension Domani {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        data = c.testo(.data) ?? ""
        giorno = c.oggetto(GiornoPiano.self, .giorno)
        pasti = c.elenco(Pasto.self, .pasti)
    }
}

extension GiornoPiano {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        indice = c.intero(.indice) ?? 0
        label = c.testo(.label) ?? ""
        settimana = c.intero(.settimana)
        libero = c.vero(.libero)
    }
}

extension Pasto {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        pasto = c.testo(.pasto) ?? ""
        etichetta = c.testo(.etichetta) ?? ""
        testo = c.testo(.testo) ?? ""
        kcal = c.intero(.kcal)
        originale = c.testo(.originale)
        alternativa = c.intero(.alternativa)
        alternative = c.contains(.alternative) ? c.elenco(Alternativa.self, .alternative) : nil
        esito = c.testo(.esito)
    }
}

extension Alternativa {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        testo = c.testo(.testo) ?? ""
        kcal = c.intero(.kcal)
        prot = c.intero(.prot)
    }
}

extension Spesa {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        piano = c.testo(.piano)
        chiave = c.intero(.chiave)
        indice = c.intero(.indice)
        giorno = c.testo(.giorno)
        settimana = c.intero(.settimana)
        reparti = c.contains(.reparti) ? c.elenco(Reparto.self, .reparti) : nil
        nonRiconosciuti = c.contains(.nonRiconosciuti) ? c.elenco(String.self, .nonRiconosciuti) : nil
        errore = c.testo(.errore)
    }
}

extension Reparto {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        nome = c.testo(.nome) ?? ""
        voci = c.elenco(Voce.self, .voci)
    }
}

extension Voce {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        alimento = c.testo(.alimento) ?? ""
        quantita = c.testo(.quantita)
        preso = c.vero(.preso)
    }
}

/// Un elemento di un elenco: se non si legge si salta, senza perdere gli altri.
struct Tollerante<T: Decodable>: Decodable {
    let valore: T?
    init(from decoder: Decoder) throws { valore = try? T(from: decoder) }
}

extension KeyedDecodingContainer {
    /// Testo; un numero (es. l'id del piano) diventa testo. nil se manca o e' null.
    func testo(_ k: Key) -> String? {
        if let s = try? decodeIfPresent(String.self, forKey: k) { return s }
        if let i = try? decodeIfPresent(Int64.self, forKey: k) { return String(i) }   // Int64: sull'orologio Int e' a 32 bit
        if let d = try? decodeIfPresent(Double.self, forKey: k), d.isFinite {
            return (d.rounded() == d && abs(d) < 1e15) ? String(Int64(d)) : String(d)
        }
        if let b = try? decodeIfPresent(Bool.self, forKey: k) { return b ? "true" : "false" }
        return nil
    }

    /// Intero; un numero con la virgola si arrotonda, un testo con un numero si legge. nil se manca o e' null.
    func intero(_ k: Key) -> Int? {
        if let i = try? decodeIfPresent(Int.self, forKey: k) { return i }
        var d: Double? = nil
        if let x = try? decodeIfPresent(Double.self, forKey: k) { d = x }
        else if let s = try? decodeIfPresent(String.self, forKey: k) { d = Double(s.trimmingCharacters(in: .whitespaces)) }
        guard let v = d, v.isFinite, abs(v) < 2_000_000_000 else { return nil }
        return Int(v.rounded())
    }

    /// Vero/falso; false se manca o e' null.
    func vero(_ k: Key) -> Bool {
        if let b = try? decodeIfPresent(Bool.self, forKey: k) { return b }
        if let i = try? decodeIfPresent(Int.self, forKey: k) { return i != 0 }
        if let s = try? decodeIfPresent(String.self, forKey: k) { return ["true", "1"].contains(s.lowercased()) }
        return false
    }

    /// Un oggetto; nil se manca, e' null o non si legge.
    func oggetto<T: Decodable>(_ tipo: T.Type, _ k: Key) -> T? {
        guard let v = try? decodeIfPresent(tipo, forKey: k) else { return nil }
        return v
    }

    /// Un elenco; [] se manca o e' null; gli elementi che non si leggono si saltano.
    func elenco<T: Decodable>(_ tipo: T.Type, _ k: Key) -> [T] {
        guard let righe = try? decodeIfPresent([Tollerante<T>].self, forKey: k) else { return [] }
        return righe.compactMap { $0.valore }
    }
}
