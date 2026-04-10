# Design System – Orientierung an CoinTracking.info

> Ziel: Die Web App soll visuell zum CoinTracking-Branding passen.
> Basis: Screenshot-Analyse der cointracking.info Homepage (Dark Theme).

---

## Farben

```css
/* Hintergründe */
--bg-darkest:    #080e1d;   /* Top-Bar / Navbar – fast schwarz */
--bg-dark:       #0d1627;   /* Haupt-Hintergrund links (Hero) */
--bg-teal:       #0d3d52;   /* Hintergrund rechts (Hero-Gradient) */

/* Gradient (Hero-Hintergrund) */
background: linear-gradient(135deg, #0d1627 0%, #0d3d52 100%);

/* Primärfarbe – CTA, Links, Akzente */
--color-primary: #1a90d9;   /* Helles Blau – Buttons, Logo "Tracking" */

/* Text */
--text-primary:   #ffffff;  /* Headlines, wichtige Inhalte */
--text-secondary: #a0b4c8;  /* Body-Text, Subtitles, Labels */
--text-label:     #7ba7c4;  /* "ALL-IN-ONE SOLUTION" – gedimmtes Blau */

/* Borders / Divider */
--border-subtle:  #1e3a5f;  /* Trennlinien, Card-Borders */

/* Button */
--btn-bg:         #1a90d9;  /* Primär-Button Hintergrund */
--btn-text:       #ffffff;  /* Primär-Button Text */
--btn-radius:     8px;      /* Rounded Corners */
```

---

## Typografie

```css
/* Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Größen */
--text-xs:   12px;   /* Labels, Badges */
--text-sm:   14px;   /* Body klein */
--text-base: 16px;   /* Standard Body */
--text-lg:   18px;   /* Subheadings */
--text-xl:   24px;   /* Section Headlines */
--text-2xl:  32px;   /* Page Headlines */
--text-3xl:  48px;   /* Hero Headline */

/* Gewichte */
--font-regular: 400;
--font-medium:  500;
--font-bold:    700;
--font-black:   800;  /* Hero Headlines */

/* Besonderheiten */
/* "ALL-IN-ONE SOLUTION" Style: */
text-transform: uppercase;
letter-spacing: 0.15em;
font-size: 12px;
font-weight: 500;
color: var(--text-label);
```

---

## Tailwind Config

```js
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      ct: {
        darkest:   '#080e1d',
        dark:      '#0d1627',
        teal:      '#0d3d52',
        primary:   '#1a90d9',
        secondary: '#a0b4c8',
        label:     '#7ba7c4',
        border:    '#1e3a5f',
      }
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    backgroundImage: {
      'ct-hero': 'linear-gradient(135deg, #0d1627 0%, #0d3d52 100%)',
    }
  }
}
```

---

## Komponenten-Styles

### Button (Primary)
```
Hintergrund: #1a90d9
Text: #ffffff
Border-Radius: 8px
Padding: 10px 20px
Font-Weight: 600
Hover: leicht heller (#2a9fe8)
```

### Navbar
```
Hintergrund: #080e1d
Text: #ffffff
Links: #a0b4c8 → Hover: #ffffff
Höhe: ~60px
```

### Card / Panel
```
Hintergrund: #0d1627 oder leicht transparentes rgba(13,22,39,0.8)
Border: 1px solid #1e3a5f
Border-Radius: 12px
```

### Input / Textarea
```
Hintergrund: rgba(255,255,255,0.05)
Border: 1px solid #1e3a5f
Text: #ffffff
Placeholder: #a0b4c8
Border-Radius: 8px
Focus: Border-Farbe #1a90d9
```

---

## Wichtigste Design-Prinzipien

- **Dark First:** Alles auf dunklem Hintergrund, kein Light Mode nötig für MVP
- **Blau als einzige Akzentfarbe:** Keine anderen Farben für CTAs/Highlights
- **Viel Whitespace:** Nicht überladen, viel Luft zwischen Elementen
- **Inter als Font:** Via Google Fonts oder next/font einbinden
