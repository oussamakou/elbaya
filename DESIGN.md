# Farm El Baya — Design System

The single source of truth for tokens, patterns, and conventions. All tokens live in the `@theme` block of [`app/globals.css`](app/globals.css). When in doubt, use a token — never a raw hex or arbitrary value.

## Colors

| Token | Hex | Use |
|---|---|---|
| `olive` | `#6F7243` | **Primary** — buttons, links, focus ring, accents (logo olive, darkened for AA contrast on cream/sand) |
| `olive-dark` | `#565932` | **Primary hover only** (`hover:bg-olive-dark`) |
| `olive-light` | `#A4A887` | Olive accents on dark sections (eyebrows, focus borders) — the logo's lighter strokes |
| `sand` | `#F5F0E8` | Page background, light surfaces |
| `cream` | `#FAF7F2` | Cards, text on dark |
| `earth` | `#2C1810` | Body text; `ghost` button hover |
| `dusk` | `#1A1A14` | Darkest surfaces (Forge, hero overlays) |
| `mist` | `#EDE8DF` | Borders, image placeholders |

**Muted text — only three values:**
- On light backgrounds: **`text-earth/75`** (body).
- On dark backgrounds: **`text-cream/70`** (body), **`text-cream/80`** (emphasis).
- Do not introduce new opacities. Anything below `/70` risks failing WCAG AA contrast.

## Shape & spacing tokens

| Token | Value | Use |
|---|---|---|
| `rounded-card` | `0.5rem` (8px) | All cards, inputs, media, surfaces |
| `rounded-full` | — | Pills, buttons, badges, the language toggle |
| `tracking-label` | `0.2em` | Eyebrows and uppercase labels |
| `tracking-wide` | `0.3em` | Extra-wide accents (e.g. the "Scroll" indicator) |

Spacing rhythm (Tailwind scale): full sections `py-20`/`py-24`; cards `p-6`; grid gaps `gap-3`/`gap-4`/`gap-5`.

## Typography
- **Display / headings:** `font-serif` (Cormorant Garamond), almost always `italic`.
- **Body / UI:** `font-sans` (DM Sans), weight 300–500.
- Editorial scale (intentional, by role): hero `text-6xl`–`text-7xl`, section `h2` `text-5xl`, card title `h3` `text-2xl`–`text-3xl`, eyebrow `text-xs`.
- Headings use `text-wrap: balance`; body uses `text-wrap: pretty` (global, in `globals.css`).

## Components & patterns

### Buttons
Prefer the [`Button`](components/ui/Button.tsx) component (`primary` | `ghost` | `dark` | `light`). Conventions every button follows:
- Press feedback: **`active:scale-[0.96]`** (never another value).
- Primary hover: **`hover:bg-olive-dark`**. Dark hover: `hover:bg-cream/20`. Ghost hover: `hover:bg-earth hover:text-cream`.
- Transitions are **explicit** — never `transition-all`. Use `transition-[scale,background-color]`.
- WhatsApp CTAs use [`WhatsAppLink`](components/ui/WhatsAppLink.tsx) with classes matching the Button variant for their context (olive on light, cream-outline on dark).

### Eyebrow (label) — canonical class
```
text-xs font-semibold uppercase tracking-label text-olive
```
Use `text-olive-light` or `text-cream/80` on dark sections.

### Card — canonical class
```
rounded-card border border-mist bg-cream p-6      (light)
border border-mist bg-sand/55 p-6                  (subtle, on cream sections)
```

### Containers
- Full-width sections: **`max-w-7xl`**.
- Text columns / reading width: `max-w-2xl`–`max-w-3xl`.
- Booking-card width: `max-w-lg`.

## Accessibility conventions
- **Keyboard focus:** global `:focus-visible` olive ring (in `globals.css`) — do not remove outlines without providing a custom indicator.
- **Touch targets:** interactive controls ≥ 40px (`min-h-10`).
- **Motion:** all respect `prefers-reduced-motion` (global).
- **Images:** every content image needs a descriptive `alt`; only true backgrounds use `alt=""`.
- **ARIA:** dialogs (`role="dialog"` + `aria-modal`), toggles (`aria-label`), live errors (`role="alert"`).

## Deliberate decisions / known debt
- **Section container widths** (`max-w-7xl` vs `6xl`/`5xl`) vary by section — currently intentional per content; standardize toward the rule above over time.
- **Content lives in 4 systems** (`messages/*.json`, `content/*.json`, inline locale ternaries, in-component arrays). This is the main source of copy drift — consolidating into `content/*.json` per locale is the recommended next refactor.
- **Component extraction** (`<Eyebrow>`, `<Card>`): the *values* are tokenized and uniform; extracting shared components is a DRY follow-up, intentionally deferred to avoid a half-migrated state.
