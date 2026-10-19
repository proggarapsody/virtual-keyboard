# Keyboard Artist

A local Svelte 5 studio for personalizing a virtual keyboard's appearance, sounds and press effects. Open a preset, customize it, play, reload, then export or import a self-contained design.

The v1 review candidate includes three editable presets, ANSI 60%/75%/full-size arrangements, English/Russian typing, global and per-key colors/legends/audio, image backgrounds, sample upload/trimming/pools, session undo, a named local library, autosave/recovery, ZIP transfer, and a mobile player. Sound requires explicit enablement. Scratchpad text is temporary.

## Review and release

[Open the review preview](https://proggarapsody.github.io/virtual-keyboard/keyboard-artist-preview/). Exact revisions and preservation checks are in [release notes](docs/RELEASE.md).

The original [public keyboard](https://proggarapsody.github.io/virtual-keyboard/) remains separate. Replacing it requires explicit user approval. This candidate is **not fully release-verified**: physical listening/touch, screen-reader checks, Firefox and WebKit audio coverage remain open. See [validation](docs/VALIDATION.md) for exact evidence and limitations.

## Development

Use Node 22.12+ (22.x) or Node 24+ and npm.

```sh
npm ci
npx playwright install chromium firefox webkit
npm run dev -- --host 127.0.0.1
npm run test -- --run
npm run check
npm run build
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=webkit --grep-invert 'user activated audio|real Web Audio|records cold|simulated simultaneous|inherited sample pools'
npm run test:e2e -- --project=firefox
```

The Firefox command currently fails at browser launch in this environment. WebKit audio is excluded above because its context remains suspended; excluded tests are not counted as passing. Run full tests on a supported audio/device setup before release. Experiments under `experiments/` are development-only and absent from `dist/`. Formatting uses `npx prettier --write src e2e`.

No accounts, backend, telemetry, service worker or guaranteed offline reopening. After necessary assets load, local editing/playback/export work without networking. Media limits appear before upload. Storage is origin-specific; exported files provide portable backups. Deleted design media is conservatively retained rather than automatically garbage-collected in this candidate.

## Project guidance

- [Agent instructions](AGENTS.md)
- [Installed project-local skills](docs/SKILLS.md)
- [Confirmed requirements](docs/PRODUCT.md)
- [Approved implementation plan](tasks/plan.md)
- [Delivery checklist](tasks/todo.md)
- [Engineering decisions and limits](docs/ENGINEERING-DECISIONS.md)
- [Visual system](DESIGN.md)
- [Asset provenance](docs/ASSETS.md)

Legacy source remains on `origin/dev`; production is on `origin/gh-pages`. The implementation branch is `feature/keyboard-artist-v1`.
