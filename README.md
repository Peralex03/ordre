# Ordre

De l’appréhension du problème à la donnée d’ordre, selon la méthode de l’Armée suisse. Tout reste sur l’appareil.

Prototype. App web autonome, dans le style de Calque : un seul `index.html`, sans serveur, données sur l’appareil, partage par QR, lien, fichier ou PDF.

- À la racine : la version construite, prête à publier (GitHub Pages).
- `src/` : sources (`shared/` socle commun, `ordre/engine.js` calcul, `ordre/app.js` interface) et `build.mjs`.

Construire : dans `src/`, `npm install`, puis `node build.mjs ordre` (sortie dans `src/dist/ordre/`).

Les textes tirés des règlements sont des reformulations courtes ; les règlements en vigueur font foi. Outil d’instruction et de préparation : ne pas y saisir d’informations classifiées.
