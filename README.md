# PromptPrint

**Every prompt leaves a print.** An AI footprint calculator for college students: fifteen questions that estimate the electricity, water and carbon behind your AI habits, grounded in published research.

## What's inside

- **Calculate:** a 15-question survey over an animated landscape that reacts to your answers, then a results page with everyday equivalents, a breakdown by activity, a scale-up to all 19.4 million U.S. college students, and toggles that show how much you'd save by changing a habit.
- **Learn:** scroll-driven explainers and charts on where a prompt goes, energy per AI task, data-center growth, water, training vs. inference, efficiency vs. growth, and student adoption.
- **Stewardship:** AI's footprint read through Catholic Social Thought: See–Judge–Act, the four permanent principles, integral ecology, and stewardship, drawing on *Laudato Si'*, *Antiqua et Nova* and Pope Leo XIV's *Magnifica Humanitas* (2026).
- **Method:** every factor, the formula, what's included and excluded, and full references.

## Data

Every number lives in [`js/data.js`](js/data.js) with its source. Key factors: 0.3 Wh per typical prompt (Epoch AI), 2.5 Wh for long-input prompts (Epoch AI), 5.15 Wh per reasoning prompt (Jegham et al. 2025), 1.35 Wh per image (Luccioni et al.), 944 Wh per 5-second video (MIT Technology Review), 3.692 mL water per Wh (Li et al.), and 0.348 g CO₂ per Wh (EPA eGRID2023).

## Run it

It's a static site with no build step. Open `index.html` in a browser, or serve the folder with any static server:

```bash
npx serve .
```

## Deploy

Any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages). Point it at the repository root with no build command.
