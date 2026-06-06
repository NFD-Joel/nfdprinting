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

Alle Daten (Profile + Einstellungen) liegen lokal im Browser (`localStorage`) —
nichts wird hochgeladen. Pro Browser/Gerät getrennt.

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

## Später hosten (optional)

Da es eine statische Datei ist, kannst du sie jederzeit auf dem Debian-VM servieren,
z. B. mit einem kleinen nginx-Container, und per Tailscale erreichen. Für jetzt
reicht das lokale Öffnen.
