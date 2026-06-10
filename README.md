# 3D-Druck Preisrechner

Einfacher Rechner, um für 3D-Drucke einen Verkaufspreis in **Guaraní (₲)** zu ermitteln.
Eine einzige Datei, keine Installation, keine Abhängigkeiten.

## Nutzung

`index.html` per Doppelklick im Browser öffnen. Fertig.

Auftragsdaten eingeben → Preis aktualisiert sich live:
- **Filament + Gewicht** → Materialkosten
- **Drucker (Watt) + Druckzeit** → Strom + Maschinenverschleiß
- **Arbeitszeit** → Nachbearbeitung/Setup
- **Fehldruck-% + Marge-%** → Aufschläge
- **Anzahl** → Gesamtpreis

Alle Daten (Profile + Einstellungen) liegen standardmäßig lokal im Browser (`localStorage`) —
nichts wird hochgeladen. Pro Browser/Gerät getrennt. Optional lässt sich das per
[Sync](#sync-geräteübergreifend) auf alle Geräte ausweiten.

## Preisformel

```
Material      = Gewicht(g) / 1000 × Filamentpreis(₲/kg)
Strom         = Leistung(W) / 1000 × Druckzeit(h) × Strompreis(₲/kWh)
Maschine      = Druckzeit(h) × Maschinen-Stundensatz(₲/h)    (Verschleiß/Abschreibung)
Arbeit        = Arbeitszeit(min) / 60 × Stundenlohn(₲/h)

Selbstkosten  = Material + Strom + Maschine + Arbeit
+ Risiko      = Selbstkosten × Fehldruck-%
+ Marge       = (Selbstkosten + Risiko) × Gewinn-%

Preis/Stück   = Selbstkosten + Risiko + Marge   (auf ₲ 500 aufgerundet)
Gesamtpreis   = Preis/Stück × Anzahl
```

## Profile & Einstellungen

- **Profile**: Filamente (Name, Preis/kg) und Drucker (Name, Watt, Stundensatz)
  speichern und per Dropdown wählen — füllt die Felder automatisch.
- **Einstellungen**: Strompreis (₲/kWh), Standard-Stundenlohn, Standard-Fehldruck-%,
  Standard-Marge-%, Rundung. Diese gelten als Vorgaben für neue Berechnungen.

Defaults beim ersten Start (anpassbar): Strompreis ₲ 350/kWh (ANDE),
Stundenlohn ₲ 25.000/h, Fehldruck 10 %, Marge 50 %.

## Sync (geräteübergreifend)

Standardmäßig liegt alles nur im jeweiligen Browser (`localStorage`) — jedes Gerät hat
seine eigene Liste. Damit Filamente/Drucker auf **allen** Geräten gleich sind, gibt es ein
optionales Sync-Backend auf Basis eines **Cloudflare Workers + KV** (kostenlos, immer online).

So aktivieren:

1. Worker deployen — siehe [`worker/README.md`](worker/README.md):
   `npx wrangler login` → `kv namespace create KV` → `secret put API_TOKEN` → `deploy`.
2. Die ausgegebene `https://nfdprinting.<sub>.workers.dev`-URL in `index.html` als
   `API_BASE` eintragen, committen, pushen (GitHub Pages aktualisiert sich).
3. Auf jedem Gerät unter **Einstellungen → Sync-Token** denselben `API_TOKEN` eingeben.

Danach gilt: Filament/Drucker auf einem Gerät hinzufügen → erscheint nach Reload auf den
anderen. Ohne eingetragenen Token bleibt alles lokal (offline-fähig wie bisher).
Konfliktlösung ist *last-write-wins* — für einen Einzelnutzer mit ein paar Geräten passt das.
