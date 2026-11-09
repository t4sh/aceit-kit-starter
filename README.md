# Aceit Kit Starter

An Eleventy and Tailwind CSS v4 starter for HTML prototypes, with reusable Nunjucks sections and standalone exports.

[Live demo](https://t4sh.github.io/aceit-kit-starter/) · [Use this template](https://github.com/t4sh/aceit-kit-starter/generate) · [Section library](https://t4sh.github.io/aceit-kit-starter/sections/) · [Fieldnotes example](https://t4sh.github.io/aceit-kit-starter/examples/fieldnotes/)

![The Fieldnotes example in Paper and Ink, with the same layout and artwork](docs/fieldnotes-preview.webp)

## Quick start

Requires Node.js 24 or newer, npm, Bash, and Perl.

```bash
bash setup.sh "My Project Name"
npm run dev
```

Open the address Eleventy prints. Change the hero title in [sections.json](src/_data/sections.json), save, and watch the preview reload. Then change your palette in [tokens.css](src/assets/css/tokens.css).

```text
src/
├── pages/               Routes and example content
├── _data/               Site settings, navigation, and section defaults
├── _includes/sections/  Reusable Nunjucks sections
└── assets/css/          Design tokens, styles, and utilities
```

## Try or export a prototype

[Fieldnotes](https://t4sh.github.io/aceit-kit-starter/examples/fieldnotes/) combines a hero, feature list, and call to action. Paper and Ink change the same page's tokens. Use **Download HTML** in the [section library](https://t4sh.github.io/aceit-kit-starter/sections/) to save the example and open it offline.

```bash
npm run build:production
npm run build:standalone
```

The static site is in `out/` and the flat HTML export is in `out-standalone/`. For a single-page prototype with hash navigation, run `npm run build:spa` after building and open `out-spa/app.html`. The Fieldnotes download includes its styles and artwork. The starter shell uses CDN fonts and renders Hugeicons as inline SVG at build time.

## Deploy to GitHub Pages

This starter builds static Eleventy output and includes a GitHub Actions workflow at
`.github/workflows/pages.yml`. Push to `main`, then enable **Settings → Pages → Source:
GitHub Actions**.

The workflow automatically prefixes internal links and assets for project sites such as
`https://owner.github.io/repository/`. For a user/organization site or custom domain, it
uses the root path automatically. To override this, add a repository variable named
`ELEVENTY_PATH_PREFIX` (for example, `/docs`).

Nunjucks runs during the build; GitHub Pages serves the generated `out/` directory and does
not execute Nunjucks or Node.js at request time.

Production metadata is controlled with environment variables:

```bash
SITE_BASE_URL=https://example.com SITE_INDEXABLE=true npm run build:production
```

`SITE_ANALYTICS_ENABLED=true` opts into the provider-neutral consent hook. It performs no
network requests itself; a project-specific integration can listen for
`site:analytics-consent`.

## Quality and production checks

```bash
npm run verify          # content, design, production build, artifact checks, tests
npm run check:a11y      # public pages × desktop/mobile/reduced-motion
npm run check:visual    # four lightweight screenshot comparisons
npm run og:generate     # deterministic 1200×630 per-route PNG images
npm run check:og-images # verify manifest, image format, and rendered references
```

The production build compiles Tailwind locally. Regular `npm run dev` retains the browser
Tailwind mode for fast prototyping. The visual CI workflow captures the base and candidate
on the same Ubuntu runner, avoiding cross-platform baseline drift. Local convenience
baselines can be refreshed with `npm run check:visual -- --update`.

## What You Get

- **3 output formats** — dev server, standalone HTML files, single-file SPA
- **Pluggable design system** — swap `tokens.css` to change Material v3, Basecoat, or custom
- **Reusable sections** — Nunjucks partials with numbered variants (hero-01, hero-02, etc.)
- **Motion-aware** — `prefers-reduced-motion` respected everywhere, single IntersectionObserver
- **View Transitions API** — smooth page transitions with graceful fallback
- **Dark mode** — flash-free toggle with localStorage persistence
- **AI-ready** — AGENTS.md + bundled skills for Claude/Cursor. Optional cross-session memory via the [`agent-memory` skill](https://skills.sh/t4sh/skills4sh/agent-memory).

## Adding Pages

Create a new `.njk` file in `src/pages/`:

```nunjucks
---
layout: layouts/page.njk
title: My Page
---

{% include "sections/hero/hero-01.njk" %}

<section class="section">
  <div class="container">
    <h1>Your content here</h1>
  </div>
</section>

{% include "sections/cta/cta-01.njk" %}
```

## Adding Sections

Create in `src/_includes/sections/{domain}/{domain}-{nn}.njk`:

```
sections/
├── hero/hero-01.njk       ← exists
├── hero/hero-02.njk       ← add your variant
├── pricing/pricing-01.njk ← add a new domain
└── features/features-01.njk
```

Use in pages via the section authoring module:

```nunjucks
{% from "macros/section.njk" import renderSection with context %}
{{ renderSection("pricing") }}
```

Default variants and content live in `src/_data/sections.json`.

Register icons in [src/\_lib/icons.js](src/_lib/icons.js) and render them with `{% icon "layers" %}`. The site mark and embedded favicon both use the layers icon.

## Changing the Design System

Edit `src/assets/css/tokens.css` — all components reference tokens via `var()`:

```css
:root {
  --primary: oklch(0.55 0.15 250); /* Change this */
  --surface: oklch(0.985 0 0); /* And this */
  /* ... */
}
```

Also update `src/_data/theme.json` to map token values to Tailwind `@theme` utilities. The layout renders that manifest into the browser Tailwind block.

## Source Reference Workflow

Drop raw HTML/React/prototype files into `source-reference/`. AI agents can convert them to 11ty pages:

1. Read `source-reference/_CONVENTIONS.md` for the conversion rules
2. Agent decomposes the source into sections
3. Agent creates `.njk` partials and pages
4. Review in dev server

## Production Extensions

Keep the starter minimal by default. When a project grows toward production, use [docs/production-extensions.md](docs/production-extensions.md) as the opt-in roadmap for docs lifecycle, visual regression, SEO/OG generation, CSP hardening, build metadata, shared tokens/chrome packages, and content drift checks.

## Commands

| Command                    | Description                   |
| -------------------------- | ----------------------------- |
| `npm run dev`              | Dev server at localhost:3000  |
| `npm run build`            | Prototype 11ty build → `out/` |
| `npm run build:production` | Compiled Tailwind + 11ty      |
| `npm run build:standalone` | Flat HTML → `out-standalone/` |
| `npm run build:spa`        | SPA → `out-spa/app.html`      |
| `npm run verify`           | Full standalone quality gate  |
| `npm run lint`             | ESLint + Stylelint            |
| `npm run format`           | Prettier                      |

## AI Agent Skills

Bundled in `.agents/skills/`. See [.agents/README.md](.agents/README.md) for setup instructions.

To sync to your global skills (recommended):

```bash
mkdir -p ~/.agents/skills
cp -r .agents/skills/* ~/.agents/skills/
```

## License

The code in this repository is released under the [MIT License](LICENSE). Fonts and libraries loaded from CDNs keep their own licenses, and your own content and the sites you build from this template are yours.
