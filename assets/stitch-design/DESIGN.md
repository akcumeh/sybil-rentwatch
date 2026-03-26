# Design System Specification: Clinical Futurism & Real Estate Trust

## 1. Overview & Creative North Star
**The Creative North Star: "The Omniscient Ledger"**

This design system is a departure from the "friendly" consumer real estate experience. It is built to feel like a high-security, high-intelligence monitoring interface—inspired by the Sibyl System’s cold, analytical precision. The aesthetic is "Clinical Futurism": an environment where data is absolute, and the interface acts as a silent, all-seeing curator of trust.

We break the "template" look by avoiding standard card-based layouts in favor of an **interconnected data grid**. We utilize intentional asymmetry—where large, serif Japanese-inspired headings sit offset against hyper-precise monospace data points—to create a sense of "Advanced Editorial" authority.

## 2. Color Architecture
The palette is rooted in the "Void"—a deep, immersive dark mode that prioritizes optical depth over flat surfaces.

### Core Palette (Material Design Mapping)
*   **Background (Void):** `#070B14` — The foundational vacuum.
*   **Surface (Surface 0):** `#0D1117` — The primary interactive floor.
*   **Primary (Scanner Teal):** `#00E5CC` — Used for active scanning, data focus, and critical "trust" metrics.
*   **Tonal Accents (Trust Tiers):**
    *   `#818CF8` (Platinum Indigo) - Institutional Level
    *   `#F59E0B` (Gold Amber) - Premium Trust
    *   `#94A3B8` (Silver Slate) - Standard Verified
    *   `#EF4444` (System Red) - Critical Violation/Risk

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Structural boundaries must be defined through:
1.  **Background Color Shifts:** Use `surface-container-low` (`#171c25`) against `surface` (`#0f131d`) to define regions.
2.  **The Ghost Border:** If a boundary is functional (e.g., an input), use `outline-variant` (`#3b4a46`) at **15% opacity**.
3.  **Scanner Lines:** Use a 1px `primary` (`#71ffe8`) line only for active-state "scanning" animations or hero-section data dividers.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, semi-transparent layers.
*   **Layer 1 (The Void):** `#070B14` (Deepest level).
*   **Layer 2 (The Grid):** Subtle `outline` (`#849490`) at 5% opacity, forming a 40px square grid.
*   **Layer 3 (The Plates):** Glass-morphic containers using `rgba(20, 27, 39, 0.85)` with a `20px` backdrop-blur.

## 3. Typography
The typographic identity relies on the tension between the ancient/traditional and the hyper-modern/computational.

*   **Display & Headlines (Zen Antique):** High-contrast, serif, Japanese-inspired. It conveys the "Legacy" and "Authority" of a trust platform. Use `headline-lg` (2rem) for property names or trust verdicts.
*   **Body & Titles (Syne):** A geometric sans-serif that feels avant-garde yet readable. Used for narrative descriptions and UI labels.
*   **Data & Metrics (JetBrains Mono):** The "Source Code" of the system. Every price, square footage, and trust score must be rendered in Mono to emphasize precision.

| Level | Token | Font | Size | Case |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Zen Antique | 3.5rem | Sentence |
| **Headline** | `headline-md`| Zen Antique | 1.75rem | Sentence |
| **Data Point**| `title-md` | JetBrains Mono | 1.125rem | All Caps |
| **Body** | `body-md` | Syne | 0.875rem | Sentence |
| **Label** | `label-sm` | JetBrains Mono | 0.6875rem | All Caps |

## 4. Elevation & Depth
In this system, elevation is not "light," it is "focus."

*   **Tonal Layering:** Instead of drop shadows, use `surface-container-highest` (`#31353f`) to bring an element forward. 
*   **The Glassmorphism Rule:** All floating cards must use a `20px` backdrop-blur. This ensures that the background Kanji accents (信, 守, 色, 評) are visible as blurred, ghostly shapes behind the data, signifying the platform's omnipresent nature.
*   **Ambient Shadows:** If a card requires a "lift" (e.g., a modal), use a shadow with a `40px` blur, `0%` spread, and color `rgba(0, 229, 204, 0.08)` (Teal Tint). This mimics the glow of a holographic projection.

## 5. Components & Elements

### The Scanner Button (Primary)
*   **Shape:** `0px` Border Radius (Hard Geometry).
*   **Fill:** `primary-container` (`#00e5cc`).
*   **Text:** `on-primary` (`#003730`), JetBrains Mono, All Caps.
*   **Effect:** A subtle 1px "scanning" pulse (gradient move) should traverse the button horizontally every 3 seconds.

### Data Cards & Lists
*   **Constraint:** No horizontal dividers. 
*   **Separation:** Use `spacing-8` (1.75rem) vertical gutters. 
*   **Identification:** Every list item should begin with a `label-sm` index number (e.g., 001, 002) in `primary` color.

### Input Fields
*   **Style:** Underline only. Use `outline-variant` for the inactive state. 
*   **Active State:** The underline transforms into the `primary` (Scanner Teal) color with a slight outer glow.
*   **Micro-copy:** Helper text must always be in `JetBrains Mono` to feel like system metadata.

### Trust Tier Chips
*   **Geometry:** 45-degree clipped corners (Brutalist geometric restraint).
*   **Colors:** Use the Tier colors (Indigo, Amber, Slate, Orange) with `10%` fill opacity and `100%` stroke opacity.

## 6. Do’s and Don’ts

### Do:
*   **Do** use extreme whitespace to allow the background Kanji watermarks to breathe.
*   **Do** align all text to a rigid, 40px baseline grid.
*   **Do** use `JetBrains Mono` for any element that represents a variable or a changing state (numbers, dates, status).
*   **Do** use hard `0px` corners for everything. The system is sharp and uncompromising.

### Don't:
*   **Don't** use rounded corners (`0px` is the absolute rule).
*   **Don't** use drop shadows that are black or grey; only use tinted, low-opacity glows.
*   **Don't** use standard "blue" for links. Use `primary` (Teal) or `secondary` (Indigo).
*   **Don't** center-align long-form text. All data is left-aligned or right-aligned against the grid axes to maintain a technical "readout" feel.

## 7. Signature Textures
To prevent the UI from feeling "flat," implement the following:
*   **The CRT Scanline:** Apply a fixed-position overlay with a repeating linear gradient (1px transparent, 1px `rgba(255,255,255,0.02)`) to simulate a high-end monitor.
*   **Kanji Backgrounds:** Place the tokens (信, 守, 色, 評) at `5%` opacity, `display-lg` size, in the background layer. They should overlap the grid but stay behind all UI "Plates."