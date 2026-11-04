import { render } from 'preact'
import { App } from './App'
import './style.css'

// Die App hängt sich an #app. Für die Einbettung in fremde Seiten (Aufgabe 7)
// funktioniert auch jedes Element mit dem Attribut data-kepler-app.
const root = document.getElementById('app') ?? document.querySelector('[data-kepler-app]')
if (root) render(<App />, root)
