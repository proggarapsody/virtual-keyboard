# Keyboard Artist

A Svelte rewrite of [virtual-keyboard](https://github.com/proggarapsody/virtual-keyboard), intended to become a studio for customizing how a virtual keyboard looks, sounds, and reacts to typing.

## Current state

Svelte 5 + TypeScript + Vite are installed. The UI is the unmodified Vite starter, not the keyboard studio. Product discovery continues before feature implementation.

The original vanilla JavaScript app remains on `origin/dev`; its published build is on `origin/gh-pages`. The original site is https://proggarapsody.github.io/virtual-keyboard/.

## Development

Use Node 22.12+ (22.x) or Node 24+ and npm.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

`check` runs Svelte diagnostics and TypeScript checks. `build` produces `dist/`. No product tests or deployment workflow have been added yet.

## Project guidance

- [Agent instructions](AGENTS.md)
- [Installed skills and sources](docs/SKILLS.md)
- [Product discovery](docs/PRODUCT.md)

Skills are vendored in `.agents/skills/` and available to project sessions. Shared upstream references and licenses are included locally.
