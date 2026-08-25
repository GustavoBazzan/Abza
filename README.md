# ABZA Sales Playbook

An interactive, single-page sales playbook for the ABZA commercial team — closing techniques, an objection-handling protocol, a question library, a roleplay lab, a pre-close checklist, and a diagnostic decision tree, all styled with the ABZA design system (Space Grotesk / Manrope / Space Mono, red-on-black brand).

Built with React + TypeScript + Vite.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Structure

- `src/data/content.ts` — all playbook copy (techniques, objections, roleplays, questions, etc.)
- `src/components/` — brand assets (`Logo`, `Symbol`) and the `Button` primitive from the ABZA design system
- `src/sections/` — one component per playbook section (hero, philosophy, techniques, objections, roleplay, checklist, diagnostic, next steps) plus the technique/objection detail modals
- `src/styles/` — design tokens, global reset, and per-section styles
