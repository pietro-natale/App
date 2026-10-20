//
//  ApiClient.swift — le tre chiamate che l'orologio fa all'API del portale
//
//  Stessa API dell'app (Worker Cloudflare), con la sessione propria dell'orologio (vedi
//  Sessione.swift): il server accetta quel token SOLO per queste tre chiamate.
//    GET  /api/mie/oggi          la giornata (pasti, stato, spesa del giorno e, dalla .46, della settimana e i
//                                prossimi appuntamenti: nessuna chiamata in piu' per la pagina «Appuntamento»)
//    POST /api/mie/diario        segna un pasto "fatto" / "saltato" / niente
//    POST /api/mie/spesa/spunta  spunta o toglie la spunta a un alimento
//

import Foundation

enum ErroreApi: LocalizedError {
    /// token: quello usato dalla richiesta rifiutata (non per forza quello di adesso: dal telefono puo' esserne
    /// arrivato uno nuovo mentre la richiesta era in viaggio)
    case sessioneScaduta(token: String)
    case rete(String)
    case server(String)

    var errorDescription: String? {
        switch self {
        case .sessioneScaduta: return "Accesso scaduto: apri l'app sull'iPhone e rientra."
        case .rete(let m): return "Nessuna connessione. \(m)"
        case .server(let m): return m
        }
    }
}

struct ApiClient {
    let base: String
    let token: String

    private func richiesta(_ via: String, metodo: String = "GET", corpo: [String: Any]? = nil) throws -> URLRequest {
        guard let url = URL(string: base + via) else { throw ErroreApi.server("Indirizzo dell'API non valido.") }
        var r = URLRequest(url: url)
        r.httpMethod = metodo
        r.timeoutInterval = 20
        r.setValue("application/json", forHTTPHeaderField: "Content-Type")
        r.setValue("Bearer " + token, forHTTPHeaderField: "Authorization")
        if let c = corpo { r.httpBody = try JSONSerialization.data(withJSONObject: c) }
        return r
    }

    private func esegui(_ r: URLRequest) async throws -> Data {
        let dati: Data
        let risposta: URLResponse
        do { (dati, risposta) = try await URLSession.shared.data(for: r) }
        catch { throw ErroreApi.rete(error.localizedDescription) }
        let stato = (risposta as? HTTPURLResponse)?.statusCode ?? 0
        if stato == 401 { throw ErroreApi.sessioneScaduta(token: token) }
        // server momentaneamente non disponibile: come senza rete (la modifica resta in coda e si riprova)
        if stato >= 500 || stato == 429 { throw ErroreApi.rete("Server non disponibile (\(stato)).") }
        if stato >= 400 {
            let corpo = (try? JSONSerialization.jsonObject(with: dati)) as? [String: Any]
            throw ErroreApi.server((corpo?["errore"] as? String) ?? "Errore \(stato) dal server.")
        }
        return dati
    }

    func oggi() async throws -> Oggi {
        let dati = try await esegui(try richiesta("/api/mie/oggi"))
        do { return try JSONDecoder().decode(Oggi.self, from: dati) }
        catch { throw ErroreApi.server("Risposta non leggibile: \(error.localizedDescription)") }
    }

    /// esito: "fatto", "saltato" oppure nil per togliere il segno.
    func segnaPasto(data: String, pasto: String, esito: String?) async throws {
        // null nel JSON toglie il segno (l'API svuota il campo se arriva null)
        let e: Any = esito.map { $0 as Any } ?? (NSNull() as Any)
        _ = try await esegui(try richiesta("/api/mie/diario", metodo: "POST",
                                           corpo: ["data": data, "pasto": pasto, "esito": e]))
    }

    func spuntaSpesa(piano: String, chiave: Int, alimento: String, preso: Bool) async throws {
        _ = try await esegui(try richiesta("/api/mie/spesa/spunta", metodo: "POST",
                                           corpo: ["piano": piano, "settimana": chiave, "alimento": alimento, "preso": preso]))
    }
}
