# Keyboard Artist v1 — delivery tasks

Status: not started. [Confirmed requirements](../docs/PRODUCT.md) are labeled P01–P20; the [plan](plan.md) explains architecture and evidence standards. Check off a task only after its acceptance and verification pass. Do not interpret this checklist as completed implementation.

Each task targets a focused session and roughly 3–5 substantive files. The listed paths are expected touchpoints, not permission to create unused scaffolding. Split a task before coding if actual scope exceeds that size. Changes to package dependencies also update the lockfile.

For code/config tasks, verification includes `npm run check` and `npm run build`, plus the focused checks below. `npm run test -- --run` and `npm run test:e2e -- --project=<browser>` become available in T02; before then they are proposed commands. Documentation tasks use link/content checks instead of app tests.

## M0 — Resolve expensive uncertainties

### T01 — Define the studio's visual execution

- [x] Complete T01. Requirements: P01, P05, P17, P19.
- Acceptance: retain the dark three-column editor and expressive keyboard; document tokens, typography, focus, component states, and a mobile player composition from the confirmed brief; settle the concrete design with the user through the installed design workflow before UI construction.
- Verify: compare references/sketches to the approved scope; verify real EN/RU labels, mixed selection, unsaved states, and usable full-size keyboard composition. Do not reopen product decisions.
- Depends on: none.
- Expected files: `DESIGN.md`, `.impeccable/surfaces/studio.md`, `docs/ASSETS.md`. Scope: small documentation/design task.

### T02 — Establish behavior-test infrastructure

- [x] Complete T02. Requirements: all verification foundations.
- Acceptance: add compatible Vitest and Playwright scripts/configuration; prove a meaningful starter-load browser check and document the exact commands; keep runtime application dependencies unchanged here.
- Verify: `npm run test:e2e -- --project=chromium`, `npm run check`, and `npm run build`; exercise one real test rather than using empty-suite success as coverage. Add the first rule test with T04 before requiring the unit-test gate.
- Depends on: none.
- Expected files: `package.json`, `package-lock.json`, `vitest.config.ts`, `playwright.config.ts`, `e2e/smoke.spec.ts`. Scope: medium.

### T03 — Prove risky browser behavior and establish limits

- [x] Complete T03. Requirements: P02, P04, P10, P11, P13, P16.
- Acceptance: a disposable browser fixture proves focus/input/composition handling, user-activated overlapping audio, and transactional blob-saving failure recovery; document supported formats, media/expanded-archive limits and runtime budgets from measured fixtures; identify unavailable real-device evidence explicitly.
- Verify: run the fixture in Chromium/Firefox/WebKit and available real Safari/touch hardware; record source/decoded sizes, decode time, chord response, cancellation, quota failure, and chosen limits in `docs/ENGINEERING-DECISIONS.md`.
- Depends on: T02.
- Expected files: `experiments/browser-contracts.html`, `experiments/browser-contracts.ts`, `e2e/browser-contracts.spec.ts`, `docs/ENGINEERING-DECISIONS.md`, small media fixtures. Scope: medium; keep experimental code out of the shipped application.

**Checkpoint M0**

- [x] Visual execution is settled; input policy and measured limits are recorded; unsupported behavior is resolved or clearly recorded as a release blocker. Do not silently reduce the product scope.

## M1 — One keyboard works

### T04 — Render the first editable design document

- [x] Complete T04. Requirements: P01, P03, P05, P07.
- Acceptance: define the versioned schema/defaults and stable 60% positions; replace the starter screen with one real preset using ordinary document data; keep temporary/session state separate.
- Verify: focused schema/inheritance tests plus browser render; assert key identity/geometry, invalid documents, and inherited values rather than a whole-page snapshot.
- Depends on: T01, T02, T03.
- Expected files: `src/lib/design/model.ts`, `src/lib/design/model.test.ts`, `src/lib/studio/Keyboard.svelte`, `src/App.svelte`, `src/app.css`. Scope: medium.

### T05 — Make Play input and mode boundaries work

- [x] Complete T05. Requirements: P02, P06, P09, P17.
- Acceptance: physical and virtual sources produce correct pressed state; Edit clicks select while Play activates; repeat, focus loss, cancellation, and source overlap do not leave stuck keys or duplicate activation.
- Verify: browser keydown/up, pointer cancellation, toolbar Enter/Space, tab escape, editor-field typing, mode switching, and blur during a chord.
- Depends on: T04.
- Expected files: `src/lib/input/keyboard-input.ts`, `src/lib/studio/Keyboard.svelte`, `src/lib/studio/session.svelte.ts`, `src/App.svelte`, `e2e/input.spec.ts`. Scope: medium.

### T06 — Deliver the temporary typing scratchpad

- [ ] Complete T06. Requirements: P04, P12.
- Acceptance: virtual typing inserts/replaces at the cursor with Shift/Caps/Backspace/Enter; chosen language and verified physical-input policy agree; clear and hide actions work without text persistence/export.
- Verify: focused text-rule tests and browser cursor/selection, paste/composition, native text undo, held-repeat, Tab, and reload behavior.
- Depends on: T05.
- Expected files: `src/lib/input/text-editing.ts`, `src/lib/input/text-editing.test.ts`, `src/lib/studio/Scratchpad.svelte`, `src/App.svelte`, `e2e/input.spec.ts`. Scope: medium.

**Checkpoint M1**

- [ ] A preset can be played and typed into without sound yet. Editor controls remain ordinary controls; focus and cancellation behavior pass real-browser checks.

## M2 — A personal design survives

### T07 — Edit global appearance and selected-key overrides

- [x] Complete T07. Requirements: P05, P06, P07.
- Acceptance: global color/font/radius/spacing controls and selected-key color/legend controls update the canvas; click/multi/group selection and mixed values are clear; resetting overrides restores property-by-property inheritance.
- Verify: component/browser flows cover selected versus unselected keys, a global change after an override, group selection, and reset. Test custom legends as text, not HTML or output mappings.
- Depends on: T04, T05.
- Expected files: `src/lib/studio/AppearanceInspector.svelte`, `src/lib/studio/commands.ts`, `src/lib/studio/session.svelte.ts`, `src/App.svelte`, `e2e/appearance.spec.ts`. Scope: medium.

### T08 — Add session undo and redo

- [x] Complete T08. Requirements: P14.
- Acceptance: document commands are undoable, drag updates coalesce, new edits clear redo; selection/typing/audition are excluded; media references can be retained by history and document switches cannot undo another design.
- Verify: rule tests and browser keyboard shortcuts, text-field undo precedence, drag coalescing, and document-switch isolation.
- Depends on: T07.
- Expected files: `src/lib/studio/history.ts`, `src/lib/studio/history.test.ts`, `src/lib/studio/commands.ts`, `src/lib/studio/session.svelte.ts`, `e2e/appearance.spec.ts`. Scope: medium.

### T09 — Autosave and restore the active design

- [x] Complete T09. Requirements: P13, P18.
- Acceptance: transactional documents/assets load after reload; serialized revision-aware saves show Saving/Saved/Unsaved accurately; failure retains the in-memory exportable snapshot and does not discard assets used by history.
- Verify: real IndexedDB reload, rapid edits, delayed writes, unavailable storage, failed transaction, and edit-during-save. Export UI comes in T19; verify the snapshot retains all necessary bytes here.
- Depends on: T03, T08.
- Expected files: `src/lib/library/repository.ts`, `src/lib/studio/save-coordinator.ts`, `src/lib/studio/session.svelte.ts`, `src/lib/studio/SaveStatus.svelte`, `e2e/persistence.spec.ts`. Scope: medium, plus dependency/lockfile change if `idb` is adopted.

**Checkpoint M2**

- [x] Customize → undo/redo → save → reload reproduces the same design. Simulated failure leaves work open and visibly unsaved. Scratchpad text is absent after reload.

## M3 — Library and visual expression

### T10 — Manage named local designs

- [x] Complete T10. Requirements: P07, P13, P14.
- Acceptance: create from preset, name/rename, duplicate, switch, and explicitly confirm deletion; preset changes create fresh designs; stale-tab/save conflicts preserve work instead of overwriting it.
- Verify: library journey with delayed saves, shared assets, deletion cancellation, empty library, and two-tab revision conflict.
- Depends on: T09.
- Expected files: `src/lib/studio/DesignLibrary.svelte`, `src/lib/library/repository.ts`, `src/lib/studio/session.svelte.ts`, `src/App.svelte`, `e2e/library.spec.ts`. Scope: medium.

### T11 — Complete layout and language switching

- [x] Complete T11. Requirements: P03, P04.
- Acceptance: exact 60%/75%/full-size inventories and EN/RU maps are validated; the UI switches layout/language; hidden settings are retained and absent keys cannot activate.
- Verify: full-size → 60% → full-size restores customized keys; switching language preserves sound/style IDs and changes typing/legends as specified; numpad/modifier behavior matches documented inventories.
- Depends on: T06, T10.
- Expected files: `src/lib/design/layouts.ts`, `src/lib/design/languages.ts`, `src/lib/design/layouts.test.ts`, `src/lib/studio/LayoutControls.svelte`, `e2e/layouts.spec.ts`. Scope: medium.

### T12 — Add background-image editing

- [x] Complete T12. Requirements: P08, P13, P14.
- Acceptance: validated images support upload/replace/remove, fit/fill, position, and dimming; edits save and undo; rejected assets preserve the prior image.
- Verify: valid/oversized/unsupported images, dimension limits, non-drag position controls, replace → undo → reload, and object-URL cleanup.
- Depends on: T03, T08, T09.
- Expected files: `src/lib/design/media-policy.ts`, `src/lib/studio/BackgroundInspector.svelte`, `src/lib/studio/commands.ts`, `src/lib/studio/Keyboard.svelte`, `e2e/backgrounds.spec.ts`. Scope: medium.

**Checkpoint M3**

- [x] Multiple named designs, all layouts/languages, and background media survive reload. Switching presets/sizes never silently destroys prior work.

## M4 — Expressive playback

### T13 — Play built-in press and release samples

- [ ] Complete T13. Requirements: P10, P17.
- Acceptance: one user-enabled Web Audio engine plays overlapping press/release voices with decoded-buffer reuse and bounded lifecycle; held repeat does not retrigger; mute works during playback and suspended contexts recover visibly.
- Verify: deterministic routing/buffer tests, browser enable/suspend/resume and chord cleanup, plus audible desktop/touch checks. Record bundled sample provenance.
- Depends on: T03, T05, T09.
- Expected files: `src/lib/audio/engine.ts`, `src/lib/audio/engine.test.ts`, `src/lib/studio/session.svelte.ts`, `e2e/audio.spec.ts`, `docs/ASSETS.md`, bundled samples. Scope: medium code task; treat asset preparation separately if substantial.

### T14 — Edit sound assignments and listening controls

- [x] Complete T14. Requirements: P07, P10.
- Acceptance: global/per-key press/release assignments, volume/pitch, and explicit silence obey inheritance; preview auditions without typing or history pollution; master volume/mute remain accessible.
- Verify: global change with one overridden key, reset, silence versus inherit, pitch/gain behavior, save/reload, and undo/redo of assignments.
- Depends on: T07, T08, T13.
- Expected files: `src/lib/studio/SoundInspector.svelte`, `src/lib/studio/AudioControls.svelte`, `src/lib/studio/commands.ts`, `src/lib/audio/engine.ts`, `e2e/audio.spec.ts`. Scope: medium.

### T15 — Add the three press effects

- [x] Complete T15. Requirements: P09, P17.
- Acceptance: physical press/glow/ripple use global controls and one-trigger lifecycles; reduced motion substitutes restrained feedback; editor focus remains visible through custom colors/effects.
- Verify: chord/hold/release/cancel behavior, reduced-motion browser setting, desktop/mobile screenshots, and a trace under repeated chords.
- Depends on: T05, T07, T11.
- Expected files: `src/lib/studio/Keyboard.svelte`, `src/lib/studio/EffectInspector.svelte`, `src/lib/studio/keyboard-effects.css`, `e2e/effects.spec.ts`. Scope: medium.

**Checkpoint M4**

- [ ] A saved custom keyboard looks and sounds different, plays chords once per lifecycle, and preserves accessible controls. Mock audio evidence is supplemented by real listening.

## M5 — Users author sound

### T16 — Upload and audition bounded audio

- [x] Complete T16. Requirements: P11, P13.
- Acceptance: supported audio is checked before reading and after decoding, stored immutably, and auditioned; limits appear before selection; decode/storage failures retain existing assignments.
- Verify: boundary-size fixtures, invalid/unsupported formats, over-duration/memory cases, cancelled uploads, and failed saves.
- Depends on: T03, T09, T13, T14.
- Expected files: `src/lib/audio/import-sample.ts`, `src/lib/design/media-policy.ts`, `src/lib/studio/SampleLibrary.svelte`, `src/lib/studio/SoundInspector.svelte`, `e2e/audio-upload.spec.ts`. Scope: medium.

### T17 — Trim samples and build variation pools

- [x] Complete T17. Requirements: P10, P11, P14.
- Acceptance: accessible start/end controls trim/audition samples; users assign sample pools with no immediate repeat and a safe one-sample case; media/trim/pool edits undo without missing assets.
- Verify: known PCM fixture boundaries, invalid trim ranges, volume/pitch, deterministic no-repeat rule tests, pointer and numeric trimming, and replace/remove → undo → reload.
- Depends on: T08, T16.
- Expected files: `src/lib/studio/SampleTrimmer.svelte`, `src/lib/audio/sample-selection.ts`, `src/lib/audio/sample-selection.test.ts`, `src/lib/studio/SoundInspector.svelte`, `e2e/audio-upload.spec.ts`. Scope: medium; split trim UI/pool UI if either grows beyond this boundary.

### T18 — Complete the three reproducible presets

- [x] Complete T18. Requirements: P01, P07, P19.
- Acceptance: mechanical, minimalist, and colorful designs use only available controls and licensed media/fonts; preset selection creates editable copies; first visit is immediately playable after audio enablement.
- Verify: inspect/edit/save/reload each preset; reconstruct distinguishing settings in the inspector; audit asset attribution and future export rights.
- Depends on: T10, T11, T12, T14, T15, T17.
- Expected files: `src/lib/design/presets.ts`, `src/lib/studio/DesignLibrary.svelte`, `docs/ASSETS.md`, `e2e/presets.spec.ts`, bundled assets. Scope: medium; prepare large asset sets as a separate focused task if needed.

**Checkpoint M5**

- [ ] A user can make a design with their own image and trimmed sounds, undo media changes, save/reload it, and use every included preset through the same controls.

## M6 — Designs travel safely

### T19 — Export a complete portable design

- [x] Complete T19. Requirements: P13, P15, P18.
- Acceptance: one versioned archive includes all required built-in/uploaded media and notices; no session/text/editor data leaks into it; export works from unsaved in-memory state when IndexedDB fails.
- Verify: archive manifest and asset-byte checks, missing-asset error, file-size bound, failed-storage export, and no hidden network fetch requirement after assets load.
- Depends on: T09, T12, T17, T18.
- Expected files: `src/lib/transfer/package-schema.ts`, `src/lib/transfer/export-design.ts`, `src/lib/studio/TransferControls.svelte`, `src/lib/studio/SaveStatus.svelte`, `e2e/transfer.spec.ts`. Scope: medium, plus package/lock changes for chosen schema/archive dependencies.

### T20 — Validate and import without partial writes

- [x] Complete T20. Requirements: P15.
- Acceptance: bounded archive parsing and media validation complete before commit; normal import creates a new ID; explicitly chosen replacement is atomic and preserves its target on failure.
- Verify: corrupted ZIP, duplicate/traversal entries, actual expanded-byte overflow, future schema, invalid values/IDs, missing/undecodable assets, storage failure, successful new import, and cancelled/failed replacement.
- Depends on: T19.
- Expected files: `src/lib/transfer/import-design.ts`, `src/lib/transfer/package-schema.ts`, `src/lib/library/repository.ts`, `src/lib/studio/TransferControls.svelte`, `e2e/transfer.spec.ts`. Scope: medium.

### T21 — Verify the complete portable/recovery journey

- [ ] Complete T21. Requirements: P03, P07, P10–P15, P18, P20.
- Acceptance: create/customize/play/reload/export/import preserves settings and media in a fresh browser context; hidden-key settings and samples survive; rejected operations leave all existing designs intact.
- Verify: Chromium/Firefox/WebKit round trips, media hashes, fresh-session audible playback, no exported scratchpad text, and offline operation after necessary assets load. Record remaining real-device gaps.
- Depends on: T20.
- Expected files: `e2e/round-trip.spec.ts`, `e2e/recovery.spec.ts`, transfer fixtures, `docs/VALIDATION.md`. Scope: medium; route discovered bugs back to their owning task.

**Checkpoint M6**

- [ ] A self-contained design can travel to a clean browser and play with matching appearance/audio. Import rejection and saving failure preserve work, and export remains available.

## M7 — Reviewable release

### T22 — Finish the mobile and distraction-free player

- [ ] Complete T22. Requirements: P02, P12, P16, P17.
- Acceptance: narrow screens show playback, local/preset/import picker, and master volume; desktop Play can hide the scratchpad; multi-touch/held Shift/Caps and scrolling coexist with usable targets.
- Verify: 320/768/1024/1440 widths, 200% zoom, portrait/landscape, pointer cancellation, actual simultaneous touches, and visible exit/mute without opening a desktop inspector.
- Depends on: T11, T15, T18, T20.
- Expected files: `src/lib/studio/Player.svelte`, `src/lib/studio/Keyboard.svelte`, `src/App.svelte`, `src/app.css`, `e2e/mobile.spec.ts`. Scope: medium.

### T23 — Complete accessibility and performance evidence

- [ ] Complete T23. Requirements: P09, P10, P17 and plan quality targets.
- Acceptance: keyboard/screen-reader/focus/contrast/reduced-motion checks pass for shipped UI/presets; lab traces meet calibrated budgets; device/browser coverage and limitations are recorded honestly.
- Verify: axe plus manual checks, real audible/touch tests, equivalent cold-load runs and warm chord traces; distinguish event-to-schedule timing from acoustic latency and lab evidence from field data.
- Depends on: T21, T22.
- Expected files: `e2e/accessibility.spec.ts`, `e2e/performance.spec.ts`, `docs/VALIDATION.md`, evidence files. Scope: medium; fix findings in focused owning-module changes before sign-off.

### T24 — Publish an isolated review preview

- [x] Complete T24. Requirements: P20.
- Acceptance: inspect actual hosting/workflow state and publish a preview without replacing the original; verify base-path assets/downloads and the complete journey at its URL; document production promotion/rollback and wait for explicit approval before replacement.
- Verify: production build, full accumulated tests, preview smoke/journey, original URL still functioning, and recorded build revision plus limitations.
- Depends on: T23.
- Expected files: `vite.config.ts`, a scoped preview workflow if required, `docs/RELEASE.md`, `docs/VALIDATION.md`, `README.md`. Scope: medium.

**Checkpoint M7 / v1 candidate**

- [ ] Every P01–P20 requirement has passing evidence; no hidden incomplete task is labeled finished. Preview and release report are ready for user review. Production replacement remains a separate explicit approval.

## Execution evidence — 2026-10-20

- Baseline: clean tree at c3ed0aa; implementation branch `feature/keyboard-artist-v1`.
- T01: `DESIGN.md` and studio brief derive concrete tokens/composition from the confirmed brief; user authorized inferred ordinary choices and no repeated design discovery. Render verification follows the first UI slice.
- T02: Vitest/Playwright installed; Chromium starter smoke passes; Svelte check/build pass. Firefox/WebKit downloads in progress; first all-browser attempt reports missing binaries, not passing coverage.
- T03 in progress: Chromium measurements in `docs/evidence/experiment-chromium.json`; aborted transaction retained the original 32 MiB blob. No physical audio/touch verification yet.

### Keyboard and durable editor increment

- T04–T06 implemented: validated schema, stable physical IDs, EN/RU maps, Edit/Play source lifecycle, temporary caret-aware scratchpad. Six rule tests and Chromium input journeys pass. Native `execCommand` insertion is retained specifically to preserve browser text undo; paste/composition remain native. Cross-browser/device acceptance remains pending.
- T07–T11 implemented: property inheritance, group/multi selection, decorative legends, coalesced history, transactional revision-aware saves, fresh presets/duplicates, confirmed deletion, retained hidden-key overrides. Chromium appearance/library/reload journeys pass. Conflict/failure and full inventory journeys remain to verify.
- `npm run check` reports zero errors/warnings; production build passes. No task with outstanding acceptance evidence is marked complete.

### Media and portability increment

- T12–T20 implemented: bounded PNG/JPEG backgrounds; one user-enabled, bounded Web Audio engine; separate press/release assignment inheritance, silence, master mute/volume, original bundled samples, three effects/presets, uploads and trim/pool editing.
- Versioned ZIP exports include media SHA-256 hashes and notices; bounded streaming import validates paths, duplicates, expanded bytes, schema, media and trim before atomic save. Imported asset IDs are renewed to prevent overwriting another design or history. New/replacement imports preserve current work on rejection.
- Chromium: uploaded image + trimmed sample round trip to a clean context passes; real Web Audio instrumentation proves one scheduling per phase despite repeats (not listening evidence). Stale-tab and injected quota recovery/export tests pass.
- WebKit input journeys pass. Audio experiment remains suspended at `AudioContext.resume()`; audible/device claims remain unavailable. Firefox launch remains unavailable. See engineering decisions.
- Accessibility first pass found accessible-name mismatches and duplicate unnamed landmarks; both corrected. Final axe run pending.

## Acceptance ledger — review candidate

All 24 tasks have implementation present. Checkboxes above mean acceptance evidence at the stated scope has passed; no unavailable device evidence is counted as a pass. Authoritative report: `docs/VALIDATION.md`.

| Task | Evidence/status |
| --- | --- |
| T01 | DESIGN.md, studio brief, token sidecar, inspected desktop/mobile/full-size captures. Finish reviewer scored scrolling, mode copy and provenance fixes resolved. |
| T02 | Vitest/Playwright/axe commands configured; real starter smoke replaced by working keyboard load. |
| T03 | Chromium input/audio/blob/image measurements recorded; WebKit Blob failure reproduced then fixed with byte storage; audio and Firefox runtime gaps explicitly recorded as release blockers. |
| T04–T05 | Schema/inheritance/inventory rules; physical/virtual source overlap and cancellation; Edit/Play/button/focus journeys pass. |
| T06 | Caret replacement, EN/RU, virtual hold, Shift/Caps, Tab and native text undo pass. **Open:** real OS IME/clipboard verification; synthetic composition events are separate evidence. |
| T07–T12 | Appearance, mixed/group/multi selection, history, delayed/coalesced saves, reload, conflict/quota export, library/delete/duplicate, layouts, background position and media undo pass. |
| T13 | Real Chromium scheduling/overlap/repeat/mute/pitch tests pass. **Open:** actual audible desktop/touch check, WebKit audio resume and Firefox runtime. |
| T14–T20 | Assignment inheritance/silence, effects/reduced motion, bounded uploads/decoded totals, trim/pools, every preset reload, self-contained hashed export, bounded invalid imports and atomic replacement failure pass. |
| T21 | Chromium/WebKit non-audible round trips and offline-after-load export pass. **Open:** Firefox and fresh-session audible playback. |
| T22 | Responsive captures, CSS 200% reflow proxy, CDP simultaneous Shift/cancel/Caps pass. **Open:** actual touch hardware, physical portrait/landscape and browser zoom. |
| T23 | Axe in two engines, keyboard journeys, trace and timing budgets pass. **Open:** screen reader, actual listening/touch and remaining manual accessibility checks. |
| T24 | Published isolated preview at `/virtual-keyboard/keyboard-artist-preview/`, application `761a5ea`, deployment `a612f3a`. Public Chromium 29 pass/2 development-only skips; WebKit 25 pass/1 development-only skip (five unsupported cases excluded). Original root hash/browser load preserved. RELEASE.md records promotion/rollback. This closes preview publication only; T21–T23 continue to block production sign-off. |

Next unfinished acceptance task is T06's real OS text-input check. Continue with the listed device/browser evidence; do not restart implementation or discovery. Milestones M1/M4/M5/M6/M7 remain unclosed where they depend on that evidence.

### Published review checkpoint

Preview: https://proggarapsody.github.io/virtual-keyboard/keyboard-artist-preview/.

19 of 24 task acceptance boxes are closed. T06/T13/T21/T22/T23 remain open for the unavailable real OS input, audible playback, Firefox, physical touch and assistive-technology evidence listed above. All planned implementation slices have been exercised; no scope interview or production replacement is pending/authorized. T24’s isolated review publication is complete despite the remaining production acceptance gates.

## Reference-led redesign — 2026-10-20

User requested replacement UI from the two supplied smoked-glass/dusk references, plus a design system. Product discovery remains closed.

- [x] Replace graphite chrome with reference-led glass workspace, tactile key surfaces, floating panels, listening dock and actual preset previews.
- [x] Extract semantic color/material/shape/spacing/motion foundations and shared Button/Icon primitives; ship a live `design-system.html` reference page.
- [x] Preserve stored designs and all existing editing/media/portable behavior; change only newly-created Tactile palette defaults.
- [x] Verify Svelte checks/build, 12 rule tests, 32 Chromium and 27 selected WebKit cases; zero axe violations in covered app/system states.
- [x] Complete fresh visual finish review and reconcile DESIGN.md/sidecar. Reviewer scored all three required corrections resolved (`docs/design/finish-review-redesign.md`).
- [x] Publish and verify the isolated preview, preserving original root site. Runtime `beb5abd`, Pages `88d68ad`; public browser and before/after root-hash evidence in docs/RELEASE.md.

Evidence: `docs/VALIDATION.md` redesign section. The five open original acceptance tasks above remain open; redesign does not supply missing device evidence.
