//
//  Archivio.swift — l'orologio senza rete
//
//  L'ultima giornata scaricata resta su disco (nella cartella dell'app, non
//  condivisa): senza rete si mostra quella, con l'ora in cui e' stata presa.
//  Le modifiche fatte senza rete (pasto fatto/saltato, spunta della spesa) vanno in
//  una coda e partono alla prima connessione, nell'ordine in cui sono state fatte.
//  All'uscita dal portale si cancella tutto.
//

import Foundation

/// Un'operazione da mandare all'API quando torna la rete.
struct OperazioneInAttesa: Codable, Equatable {
    enum Tipo: String, Codable { case esito, spunta }
    var tipo: Tipo
    var quando: Date
    // esito
    var data: String?
    var pasto: String?
    var esito: String?
    // spunta
    var piano: String?
    var chiave: Int?
    var alimento: String?
    var preso: Bool?
}

enum Archivio {
    private static let fileGiornata = "giornata.json"
    private static let chiaveCoda = "coda-operazioni"

    private static var cartella: URL {
        let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first
            ?? FileManager.default.temporaryDirectory
        try? FileManager.default.createDirectory(at: base, withIntermediateDirectories: true)
        return base
    }

    // MARK: giornata

    struct Salvata { var dati: Oggi; var quando: Date }

    static func salva(_ dati: Oggi) {
        let busta = Busta(quando: Date(), dati: dati)
        guard let d = try? JSONEncoder().encode(busta) else { return }
        // leggibile dopo il primo sblocco (come il token nel portachiavi): l'aggiornamento in sottofondo e i
        // promemoria girano anche con l'orologio bloccato, tolto dal polso o in carica
        try? d.write(to: cartella.appendingPathComponent(fileGiornata), options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication])
    }

    static func leggi() -> Salvata? {
        guard let d = try? Data(contentsOf: cartella.appendingPathComponent(fileGiornata)),
              let b = try? JSONDecoder().decode(Busta.self, from: d) else { return nil }
        return Salvata(dati: b.dati, quando: b.quando)
    }

    private struct Busta: Codable { var quando: Date; var dati: Oggi }

    // MARK: coda

    static func coda() -> [OperazioneInAttesa] {
        guard let d = UserDefaults.standard.data(forKey: chiaveCoda),
              let c = try? JSONDecoder().decode([OperazioneInAttesa].self, from: d) else { return [] }
        return c
    }

    static func scriviCoda(_ c: [OperazioneInAttesa]) {
        if c.isEmpty { UserDefaults.standard.removeObject(forKey: chiaveCoda); return }
        if let d = try? JSONEncoder().encode(c) { UserDefaults.standard.set(d, forKey: chiaveCoda) }
    }

    /// Aggiunge un'operazione; se ne esiste gia' una sullo stesso oggetto la sostituisce
    /// (conta l'ultimo gesto, non la storia dei gesti).
    static func accoda(_ op: OperazioneInAttesa) {
        var c = coda()
        c.removeAll { x in
            x.tipo == op.tipo && ((op.tipo == .esito && x.data == op.data && x.pasto == op.pasto)
                                  || (op.tipo == .spunta && x.piano == op.piano && x.chiave == op.chiave && x.alimento == op.alimento))
        }
        c.append(op)
        if c.count > 300 { c.removeFirst(c.count - 300) }
        scriviCoda(c)
    }

    /// Toglie quell'operazione (la prima uguale), lasciando le altre come sono: un tocco fatto mentre la coda
    /// si svuota resta, e se ha sostituito l'operazione in viaggio non viene tolto al suo posto.
    static func togli(_ op: OperazioneInAttesa) {
        var c = coda()
        if let i = c.firstIndex(of: op) { c.remove(at: i) }
        scriviCoda(c)
    }

    /// Le operazioni in coda applicate a una giornata salvata: cosi' senza rete si vede
    /// quello che si e' segnato, non la fotografia di prima.
    static func applica(_ coda: [OperazioneInAttesa], a dati: Oggi) -> Oggi {
        var d = dati
        for op in coda {
            switch op.tipo {
            case .esito:
                guard op.data == d.data, let i = d.pasti.firstIndex(where: { $0.pasto == op.pasto }) else { continue }
                d.pasti[i].esito = op.esito
            case .spunta:
                // la lista del giorno e quella della settimana hanno spunte diverse (chiave diversa)
                for kp in [\Oggi.spesa, \Oggi.spesaSettimana] as [WritableKeyPath<Oggi, Spesa?>] {
                    guard var s = d[keyPath: kp], s.piano == op.piano, s.chiave == op.chiave, var reparti = s.reparti else { continue }
                    for r in reparti.indices {
                        if let k = reparti[r].voci.firstIndex(where: { $0.alimento == op.alimento }) { reparti[r].voci[k].preso = op.preso ?? false }
                    }
                    s.reparti = reparti; d[keyPath: kp] = s
                }
            }
        }
        return d
    }

    static func cancellaTutto() {
        try? FileManager.default.removeItem(at: cartella.appendingPathComponent(fileGiornata))
        UserDefaults.standard.removeObject(forKey: chiaveCoda)
    }
}
