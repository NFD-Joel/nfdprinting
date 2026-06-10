# Sync-Backend (Cloudflare Worker + KV)

Winziges API, das den gemeinsamen Zustand des Preisrechners (Filamente, Drucker,
Einstellungen) hält, damit alle Geräte dieselbe Liste sehen. Frei (Cloudflare Free Tier),
immer erreichbar, eigene `*.workers.dev`-URL.

## Endpunkte

Alle Anfragen brauchen `Authorization: Bearer <API_TOKEN>`.

| Methode | Pfad    | Wirkung                                            |
|---------|---------|----------------------------------------------------|
| `GET`   | `/data` | Liefert gespeicherten Zustand (`{}` falls leer).   |
| `PUT`   | `/data` | Überschreibt den Zustand (JSON-Body, last-write-wins). |

## Deploy (einmalig)

```bash
cd worker
npx wrangler login                       # interaktiv — im Browser bestätigen
npx wrangler kv namespace create KV      # gibt eine id aus → in wrangler.toml eintragen
npx wrangler secret put API_TOKEN        # langen Zufalls-Token eingeben (z.B. `openssl rand -hex 24`)
npx wrangler deploy                      # gibt die https://nfdprinting.<sub>.workers.dev URL aus
```

Danach:

1. Die ausgegebene Worker-URL als `API_BASE` oben in `../index.html` eintragen, committen, pushen.
2. Im Rechner unter **Einstellungen → Sync-Token** denselben `API_TOKEN` auf jedem Gerät einmal eingeben.

## Test

```bash
TOKEN=...
URL=https://nfdprinting.<sub>.workers.dev
curl -s -H "Authorization: Bearer $TOKEN" "$URL/data"          # -> {} oder gespeicherter Zustand
curl -s "$URL/data"                                            # -> 401 unauthorized
```
