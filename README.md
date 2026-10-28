# Derby2party — Site Vitrine & Billetterie Officielle ⚽

> **"Le stade vient à vous."**  
> Derby2party réunit les supporters autour des grands matchs africains (CAN, qualifications, grands derbys) : écran géant 4K, musique & DJ sets (Afrobeats, Amapiano), street food africaine (alloco, pastels, bissap) et ambiance collective garantie.

---

## 🚀 Démarrage Rapide

Le site fonctionne immédiatement sans configuration complexe ni dépendances lourdes.

### Lancer le serveur local ou construire pour la production :

```bash
# Développement local (serveur actif sur http://localhost:3000) :
npm run dev
# ou
npm start

# Construction pour la production (génère le dossier /dist optimisé) :
npm run build
```

Ouvrez ensuite votre navigateur à l'adresse : **`http://localhost:3000`**

---

## 🎨 Direction Artistique & Métaphores Visuelles

Le design respecte rigoureusement la charte établie :
- **AUCUN visage, AUCUNE photo de personne**
- **Métaphores visuelles fortes** :
  - **Ballon = Battement de cœur** : animation pulse rythmée et cercle concentrique ECG (`assets/icons/ball-pulse.svg`)
  - **Confettis = Explosion de joie au but** : moteur canvas haute performance (`src/js/confetti.js`) aux couleurs de la marque
  - **Motifs Wax & Lignes de terrain** : SVG géométrique discret (`assets/wax-pattern.svg`)
  - **Table partagée & Écharpe sur la chaise** : symbole de convivialité et d'appartenance ("La place t'attend")
  - **Billet Doré Stylisé** : invitation VIP avec effet métallisé holographique, encoches de perforation billetterie et QR Code SVG unique
- **Palette de couleurs** :
  - Vert profond : `#0B3D2E`
  - Or chaud : `#F2B134`
  - Rouge chaud : `#D6402B`
  - Noir nuit : `#0E0E0E`
  - Blanc cassé : `#FAF6EE`

---

## 📂 Comment Personnaliser les Visuels & Contenus

### 1. Remplacer les vidéos et images du site
Tous les médias d'ambiance se trouvent dans le dossier `assets/` :
- **Vidéo d'arrière-plan Hero** : `assets/hero.mp4` (vidéo boucle 1080p transition wax vers stade) avec son image de secours `assets/hero.jpg`.
- **Vidéo d'immersion Ambiance** : `assets/ambiance.mp4` (tirée du screenrecord vertical réel des supporters avec son activable en 1 clic) et son poster `assets/ambiance.jpg`.
- **Bannière Watch Party** : `assets/banner.mp4` (vidéo d'ambiance collective dans la section Parrainage).
- **Visuels des blocs d'expérience** :
  - `assets/concept-a.jpg` : bloc Écran Géant & Acoustique
  - `assets/concept-b.jpg` : bloc Musique & DJ Sets
  - `assets/concept-c.jpg` : bloc Street Food & Alloco Bar

### 2. Modifier ou Ajouter des Matchs dans le JSON
Le fichier des données se trouve à l'emplacement : **`src/data/matchs.json`**.  
Chaque match est un objet structuré comme suit :

```json
{
  "id": "civ-sen-2026",
  "competition": "CAN",
  "competitionLabel": "Coupe d'Afrique des Nations",
  "title": "Côte d'Ivoire vs Sénégal",
  "subtitle": "Le Choc des Éléphants & des Lions de la Teranga",
  "date": "2026-11-14",
  "formattedDate": "Samedi 14 Novembre 2026",
  "time": "20:45",
  "doorsOpen": "19:00",
  "location": "Le Ground Control, Paris 12e",
  "address": "81 Rue du Charolais, 75012 Paris",
  "price": 18,
  "remainingSeats": 38,
  "totalSeats": 280,
  "status": "Dernières places",
  "teams": {
    "home": { "name": "Côte d'Ivoire", "code": "CIV", "accent": "#F77F00" },
    "away": { "name": "Sénégal", "code": "SEN", "accent": "#00853F" }
  }
}
```

*Le compte à rebours du Hero, les jauges de places restantes, les filtres par compétition et le stepper de réservation s'adaptent automatiquement à toute modification de ce fichier.*

---

## 💳 Billetterie & Intégration Paiement (Stripe)

- Le parcours de réservation se fait en **3 étapes fluides** (Choix du match → Quantité de 1 à 8 places avec remise groupe -10% dès 4 places et option Street Food Box → Récapitulatif et coordonnées).
- **Paiement simulé sécurisé** : aucune vraie coordonnée bancaire n'est prélevée.
- **Emplacement prêt pour Stripe** : dans `src/js/stepper.js`, la méthode de soumission de formulaire est conçue pour accueillir directement votre appel à `stripe.redirectToCheckout()` ou aux `Elements Stripe`.
- **Génération du Billet Doré** : à la validation, un billet stylisé avec QR code unique (`D2P-XXX-XXXXXX`), boutons d'impression/téléchargement et simulation Apple Wallet est généré sous une pluie de confettis.

---

## 📱 Mobile First & Performance Lighthouse

- **Mobile First** : optimisé pour iPhone (390px) et écrans larges (1440px+).
- **Accessibilité** : contrastes vérifiés AA, navigation clavier complète, support de `prefers-reduced-motion`.
- **Zéro dépendance bloquante** : architecture moderne ES Modules, CSS personnalisé ultra-optimisé, canvas natif. Score Lighthouse > 90.

---

*Fait avec passion pour la communauté du football africain.*
