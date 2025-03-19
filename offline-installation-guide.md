# Anleitung: Goblinstadt Ressourcen-App offline nutzen

Diese Anleitung erklärt, wie Sie die Goblinstadt Ressourcen-Verwaltungs-App auf Ihrem iPhone installieren und offline nutzen können.

## Dateien vorbereiten

1. Laden Sie alle diese Dateien in ein Verzeichnis auf Ihrem Computer:
   - `index.html` (die aktualisierte HTML-Datei)
   - `styles.css` (mit den ergänzten CSS-Stilen)
   - `app.js` (die JavaScript-Logik)
   - `manifest.json` (für die App-Installation)
   - `sw.js` (der Service Worker für Offline-Funktionalität)

2. Erstellen Sie App-Icons:
   - Exportieren Sie die SVG-Datei als PNG in zwei Größen:
     - `icon-192x192.png` (192×192 Pixel)
     - `icon-512x512.png` (512×512 Pixel)
   - Oder nutzen Sie bestehende Icon-Generatoren online

## Lokale Testmethode

### Option 1: Mit lokalem Webserver
1. Installieren Sie einen lokalen Webserver auf Ihrem Computer (z.B. XAMPP, Node.js http-server)
2. Hosten Sie die Dateien lokal
3. Öffnen Sie die App über Ihr lokales Netzwerk auf dem iPhone
4. Installieren Sie die App (siehe unten)
5. Die App funktioniert nun auch offline

### Option 2: Mit Datei-Hosting-Dienst

1. Laden Sie alle Dateien auf einen einfachen Hosting-Dienst hoch (GitHub Pages, Netlify, etc.)
2. Öffnen Sie die URL auf Ihrem iPhone
3. Installieren Sie die App (siehe unten)
4. Trennen Sie die Verbindung - die App funktioniert offline

## App auf dem iPhone installieren

1. Öffnen Sie die Webseite in Safari auf Ihrem iPhone
2. Tippen Sie auf das Teilen-Symbol (Pfeil nach oben)
3. Scrollen Sie nach unten und tippen Sie auf "Zum Home-Bildschirm"
4. Optional: Passen Sie den Namen an
5. Tippen Sie auf "Hinzufügen"

Die App erscheint nun als Icon auf Ihrem Homescreen und funktioniert wie eine native App - auch ohne Internetverbindung!

## Nutzung ohne Internet

Nach der Installation können Sie die App komplett offline nutzen:

1. Tippen Sie auf das App-Icon auf Ihrem Homescreen
2. Die App startet im Vollbildmodus
3. Alle Daten werden lokal auf Ihrem Gerät gespeichert
4. Sie können Ressourcen hinzufügen, entfernen und anpassen
5. Alle Änderungen bleiben erhalten, auch wenn Sie die App schließen

## Hinweise

- Die App zeigt an, ob Sie online oder offline sind
- Alle Ihre Ressourcendaten werden im lokalen Speicher Ihres Geräts gesichert
- Sie können die App jederzeit vom Homescreen löschen, indem Sie lange auf das Icon drücken und "Entfernen" wählen
