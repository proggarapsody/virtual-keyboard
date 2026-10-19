# Isolated review preview

## Reference-led redesign (2026-10-20)

Runtime source revision: `beb5abd63c2fe184aaabd29ef95c5be641527575` (UI increment `1b83b2f`). Scoped Pages deployment: `88d68adbf767d2be6f009a7d687745759e6a3325`. Review URL remains https://proggarapsody.github.io/virtual-keyboard/keyboard-artist-preview/. Live design-system page: https://proggarapsody.github.io/virtual-keyboard/keyboard-artist-preview/design-system.html. This update replaces review chrome only; original root site remains protected by the scoped publish script. The exact runtime marker is served by `build.json`; the Pages build/deploy run completed successfully. Final public checks are recorded below.

## Earlier v1 preview checkpoint

Published preview: [https://proggarapsody.github.io/virtual-keyboard/keyboard-artist-preview/](https://proggarapsody.github.io/virtual-keyboard/keyboard-artist-preview/).

Application revision: `761a5ea528f793a3e1ae8b6e8bd63f73cd040fcf`. Pages deployment commit: `a612f3ad5c7be6718245aaa9f689ec6d6418763c`; original baseline Pages revision: `2493189a8b43e9117a2773b19dc9caab586ed5c4`. GitHub Pages reports `built` with no build error. The preview’s `build.json` returns the application revision above.

## Hosting inspection

GitHub Pages API reports legacy branch deployment from `gh-pages:/`, no custom domain, and no Actions workflows. The original public site is https://proggarapsody.github.io/virtual-keyboard/. Its root HTML SHA-256 before preview publication is `401a8b644031ac85395b6b2bfdbf18986b76ee6c36339af07ab16f5389c440c0`.

The preview adds only `keyboard-artist-preview/` to the existing Pages tree. It does not replace root HTML/assets, change the Pages source, rewrite legacy history, or merge the implementation into main. The implementation remains on `feature/keyboard-artist-v1`.

## Publish

`scripts/publish-preview.sh` builds with the explicit nested base path, creates an isolated temporary checkout from the current remote Pages head, copies only `dist/` into the preview directory, verifies every changed path starts with that directory, commits, and pushes a fast-forward update. `build.json` in the preview records the exact application revision. Concurrent Pages changes cause normal push rejection rather than a forced overwrite.

## Promote and roll back

Production promotion is a separate future change requiring the user's explicit approval after the acceptance gaps in VALIDATION.md are resolved. No promotion action is included in the preview script.

Preview rollback: revert the latest scoped deployment commit to restore the previous preview on `gh-pages`, or remove only `keyboard-artist-preview/` in a new commit. Leave root files and legacy branch history intact. Before any production replacement, archive the exact original Pages revision and verify restoration from that revision; no production rollback is needed for this isolated preview because root files are unchanged.

## Public URL verification

- Chromium: 29 production-browser checks pass, two development-only checks skipped (disposable experiment and injected source-module timing boundary). Core create/customize/play/reload/export/import, actual Web Audio scheduling, uploads/limits/recovery, offline-after-load export, axe, responsive rendering and CDP multi-touch run at the nested preview URL.
- WebKit: 25 non-audio production-browser checks pass, one development-only timing check skipped. Five audio/performance/CDP-only tests are excluded and are not counted as passing. WAV/MP3/Ogg decode, persistence and portability pass. Audible Safari playback remains unverified.
- Raw reports: `docs/evidence/preview-chromium-results.json`, `preview-webkit-results.json`; lab timing/trace in `performance.json` and `chord-trace.json.gz`.
- Every changed deployment path begins `keyboard-artist-preview/` (nine files). Root HTML SHA-256 remains `401a8b644031ac85395b6b2bfdbf18986b76ee6c36339af07ab16f5389c440c0`, identical before/after deployment. A real Chromium visit to the original URL returned 200, rendered its keyboard and textarea, responded to typing, and reported zero page errors or failed requests. `original-site.json` records that check; it is not a new audit of legacy behavior.
- Temporary deployment checkout removed; no development server is needed by the public preview. Production root and Pages settings are unchanged.

The preview is available for review. It is not a production-promotion sign-off: the unchecked audio/device/assistive-technology/browser gates in VALIDATION.md still apply.

The final preview update fixes shared variation history for inherited sample pools. Its deterministic real-buffer regression check passes across different keys. First scoped publication was `48e7d3b`; the final update is `a612f3a`. Both preserve every original root file.

### Publication copy fix

The first redesign deployment exposed rsync's size/mtime quick-check: the checked-out old `build.json` and freshly generated marker had the same size and timestamp second, so the marker was skipped. Publishing now uses `rsync -ac --delete` to compare file contents. A disposable same-size/same-timestamp old/new fixture verifies replacement. The first redesign Pages commit `2158064` is superseded by the checksum-verified publication below.

### Redesign public verification

- Pages run [39288685087](https://github.com/proggarapsody/virtual-keyboard/actions/runs/39288685087) completed successfully for `88d68ad`; public `build.json` reports exact runtime source `beb5abd63c2fe184aaabd29ef95c5be641527575`.
- Public Chromium: **30 pass, 2 development-only skips**. Public WebKit: **26 pass, 1 development-only skip**, with the same five unsupported audio/performance/CDP cases excluded. These cover the new live system page as well as existing app flows. Reports: `evidence/redesign-preview-common-results.json`, `redesign-preview-chromium-audio-results.json`, `redesign-preview-summary.json`.
- A persistent real Chromium session loaded the previous deployed UI, saved its default design, then reloaded the redesign: the authored cap color `#d9d4c9` and radius `7` survived while chrome changed to Manrope. Before/after DOM evidence: `redesign-existing-before.txt`, `redesign-existing-after.txt`. The new Tactile preset has independent dark/rose defaults. No user storage was migrated or overwritten by chrome styling.
- Console check after reload: zero messages/errors/warnings. Original root HTML SHA-256 before and after remains `401a8b644031ac85395b6b2bfdbf18986b76ee6c36339af07ab16f5389c440c0`. Git also verifies every original Pages path is identical; all 17 changed paths are scoped to the preview (`redesign-deployment-scope.json`).
- Current `performance.json`/trace contain public-preview Chromium lab measurements; `redesign-local-performance.json` preserves the preceding local run. No field performance or actual listening claim is made.
- The cancelled first redesign run and transient legacy Pages build-status errors were superseded by the successful Actions deployment and exact public revision check. Preview remains separate from the original site, with no production promotion.
