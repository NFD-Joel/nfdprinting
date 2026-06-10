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

Filamente, Drucker und Einstellungen werden **automatisch auf allen Geräten** synchronisiert,
über ein **Cloudflare Worker + KV**-Backend (kostenlos, immer online). Nichts einzustellen:
Seite öffnen → Status unter *Einstellungen* zeigt „Synchronisiert". Lokal (`localStorage`)
dient als Offline-Cache. Filament auf einem Gerät hinzufügen → erscheint nach Reload auf den
anderen. Konfliktlösung ist *last-write-wins* — für einen Einzelnutzer mit ein paar Geräten passt das.

**Sicherheits-Hinweis:** Damit es ohne manuelles Login funktioniert, liegt der `API_TOKEN`
fest in `index.html` (`API_TOKEN`-Konstante) und ist damit im öffentlichen Seitenquelltext
sichtbar. Wer die Worker-URL findet, kann die Liste lesen/überschreiben. Bei Missbrauch:
neuen `API_TOKEN` setzen (`npx wrangler@3 secret put API_TOKEN`) und in `index.html` ersetzen.

Backend deployen/neu aufsetzen — siehe [`worker/README.md`](worker/README.md). Wichtig: Bei
Node < 22 `npx wrangler@3` statt `npx wrangler` verwenden.
