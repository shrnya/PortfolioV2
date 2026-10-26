# Sharanya's portfolio site

Astro + MDX, plain CSS with tokens in `src/styles/global.css`. No other dependencies.

- `npm install`, then `npm run dev` to work locally, `npm run build` for `dist/`.
- Pages: `src/pages/index.astro` (home), `src/pages/work/*.mdx` (case studies, using `src/layouts/CaseStudy.astro`).
- Prototypes inside case studies live in `src/components/prototypes/`.
- "To confirm" notes come from `<Draft>`. Build with `PUBLIC_DRAFTS=false` to hide them for launch.
- Case studies run in Journal mode: pen notes (`Note`), circles (`Circle`) and the comic avatar (`Say`) draw in as you scroll. The avatar face and the hero sketch are generated placeholders, meant to be swapped for Sharanya's own drawings.
- `node scripts/make-preview.mjs` turns `dist/` into `dist-preview/` with relative links, for sharing a static preview.
- Needs Node 22.12+ (Astro 6). Deploy target: Vercel (framework preset Astro, output `dist/`). Set `PUBLIC_DRAFTS=false` in the Vercel project's environment variables for production.
