# DERBY2PARTY VIP EXPERIENCE — Culture Drop 001

Official responsive web application for **DERBY2PARTY VIP EXPERIENCE**, uniting African football heritage, matchday culture, digital VIP membership, and the Prediction Club.

## Connected Pages

1. **PAGE 1 – VIP ACTIVATION**
   - Main Headline: `WELCOME TO YOUR VIP EXPERIENCE.`
   - Subtitle: `Your culture. Your game. Your access.`
   - Official Derby2Party emblem (`assets/derby2party-logo.png`) and night stadium pitch backdrop (`assets/stadium-hero.jpg`).
   - Interactive **`ACTIVATE MY VIP PASS`** button that activates the user's pass locally and transitions to Page 2.

2. **PAGE 2 – MY VIP PASS**
   - Displays the untouched official Derby2Party VIP Pass artwork (`assets/vip-pass-gold-card.png` / `assets/vip-pass-black-card.png` and full studio frames `assets/vip-pass-gold.jpg` / `assets/vip-pass-black.jpg`) with interactive 3D tilt and specular sheen.
   - **Edition**: `Culture Drop 001`
   - **Utility**: `Exclusive VIP access`
   - **Membership Benefits**: Exclusive experiences, Prediction Club access, VIP community, and Rewards.
   - **Button**: **`ACCESS PREDICTION CLUB`** to open Page 3.

3. **PAGE 3 – PREDICTION CLUB**
   - Curated African & Continental Football Derbies dashboard.
   - Score prediction steppers (`+` / `-` and direct numeric inputs) stored locally in `localStorage`.
   - **Points System**:
     - **Exact score** = `3 points`
     - **Correct outcome (Win/Draw/Loss)** = `1 point`
     - **Incorrect prediction** = `0 points`
   - Live **My Submitted Predictions** vault, dynamic **VIP Leaderboard** with sample members + live user ranking, and unlockable **Prediction Club Rewards**.

## Future QR Code Activation Readiness

Physical jersey tags or printed VIP passes can link directly to the site with URL parameters to auto-verify and open the VIP Pass:

```
https://your-domain.vercel.app/?pass=D2P-CD001-0842&edition=gold
```

## Free 1-Click Deployment Options

- **Vercel / Netlify Drop (Instant Static Deploy)**: Drag and drop this folder directly into [Netlify Drop](https://app.netlify.com/drop) or deploy via [Vercel](https://vercel.com) — `index.html` and `assets/` work immediately with zero paid services or build config required.
- **Local Preview**:
  ```bash
  python3 -m http.server 8080
  ```
  Then open `http://localhost:8080`.
