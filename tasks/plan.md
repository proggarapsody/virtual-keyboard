# Keyboard Artist v1 — implementation plan

Status: proposed technical plan, 2026-10-20. [Product scope](../docs/PRODUCT.md) is confirmed; [delivery tasks](todo.md) are unstarted. This planning change adds no runtime features or dependencies.

## Approach and planning inputs

Build usable slices: one playable keyboard; customization with durable saving; sound authoring; portable files; mobile and release evidence. Address input, accessibility, and recovery from the beginning.

Retain Svelte 5 + TypeScript + Vite. No backend, SvelteKit migration, global state library, or service worker is needed for the confirmed scope. Keep legacy branches as references and replace the starter incrementally on an implementation branch.

Skills applied:

- [spec-driven-development](../.agents/skills/spec-driven-development/SKILL.md): approved requirements, boundaries, dependencies, and checkpoints. The user explicitly confirmed scope and requested planning, so no repeated scope gate is needed.
- Its pinned upstream [planning-and-task-breakdown](https://github.com/addyosmani/agent-skills/blob/aeac41d4d005999432bb7312f7ff06383a91d59d/skills/planning-and-task-breakdown/SKILL.md): vertical slices and `tasks/` conventions. Read as a reference, not installed as another skill.
- [frontend-ui-engineering](../.agents/skills/frontend-ui-engineering/SKILL.md): composition, state ownership, interaction states; translate framework examples into Svelte.
- [Svelte best practices](../.agents/skills/svelte-core-bestpractices/SKILL.md) and [code writer](../.agents/skills/svelte-code-writer/SKILL.md): runes, derived state, keyed rendering, contextual state, events, component validation.
- [Impeccable](../.agents/skills/impeccable/SKILL.md) and [frontend-design](../.agents/skills/frontend-design/SKILL.md): restrained editor, expressive canvas, intentional tokens, rendered review. The Vite starter is not visual authority; detailed visual direction is a first implementation task.
- [performance](../.agents/skills/performance/SKILL.md), [accessibility](../.agents/skills/accessibility/SKILL.md), and [code-review-and-quality](../.agents/skills/code-review-and-quality/SKILL.md): measured evidence, keyboard/focus behavior, and review of implementation increments.

## Proposed capability map

These are modules, not services. Providers never import their UI consumers.

| Stable module id | Responsibility | Depends on |
| --- | --- | --- |
| design-model | Versioned document, layouts, languages, inheritance, validation | — |
| design-library | Transactional local documents/media, revision checks, recovery | design-model |
| keyboard-input | Physical/pointer lifecycle and text-editing intents | design-model |
| audio-playback | Enable/resume, decoded-buffer cache, voices, assignment playback | design-model |
| portable-design | Bounded validation and packaging of documents/media | design-model |
| keyboard-studio | Svelte UI, commands/history, selection, saves, media tools, presets | all providers above |

The studio supplies audio with asset bytes through a loader interface and supplies the package codec with a document and blobs. Neither provider imports the database or a Svelte component.

Suggested locations: `src/lib/design/`, `library/`, `input/`, `audio/`, `transfer/`, and `studio/`. Keep components/tests with their owning feature. Store bundled assets under `public/` with attribution. Browser journeys live in `e2e/`. Create files when a slice needs them, not as an empty scaffold.

### Code conventions

Use TypeScript, PascalCase component filenames, kebab-case module filenames, named feature APIs, and colocated behavior tests. Preserve the existing two-space indentation, single quotes, and no-semicolon style. The current entrypoint provides the starting convention:

```ts
import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
```

Use Svelte 5 event attributes and runes for new components. Keep browser side effects behind narrow services, render legends as ordinary text, and validate external data at its boundary. Centralize design tokens; use scoped styles and CSS custom properties for per-design values. Avoid generic infrastructure that has only one consumer.

## Proposed data and state contracts

### Durable document and temporary session

A versioned document holds ID/name/revision, layout/language, global appearance/effects, keyed visual overrides, global/per-key audio assignments, and immutable asset references. Assignments contain separate press/release pools, volume/pitch, and trim metadata. An absent override means inheritance; explicit silence differs from inherited sound.

Session state holds Edit/Play, selection, active input sources, scratchpad/caret, audio enablement, save status, and undo/redo. Proposed local preferences include master volume/mute; importing a design must not unexpectedly change listening volume. Never export session state, scratchpad text, history, object URLs, or decoded buffers.

Use Svelte `$state` for UI and `$derived` for resolved values. Immutable document revisions can use `$state.raw`. Keep blobs, audio buffers, service handles, and AudioContext outside deep proxies. Provide typed context at the studio root. Commands own edits/history; effects only synchronize external systems.

### Stable positions and history

Keep key IDs aligned with physical DOM codes where available, independently of geometry, EN/RU character maps, and decorative legends. Layout changes select an active inventory without deleting hidden-key settings. Resolve each overridable property independently.

One action produces one undoable command; coalesce a slider drag into one step. Selection, typing, and auditions do not enter document history. Switching designs must not let undo mutate another document. Retain immutable assets referenced by the current document or undo/redo entries. Garbage collection must respect other designs and all retained history references.

### Saving and failures

Use IndexedDB for documents/blobs; propose the small [`idb`](https://github.com/jakearchibald/idb) wrapper for transactions. Serialize/coalesce saves. Display Saved only after transaction completion; label each save with document ID/revision so late work cannot overwrite a newer revision or another active design.

Save documents and new assets atomically, decoding media before opening the transaction. On failure retain in-memory edits/assets so export still works. Detect stale revisions from another tab; preserve local work for export/duplication instead of silently overwriting it. Handle blocked upgrades, denied storage, and quota failures. Storage is origin-specific and can be evicted; exported files provide the portable backup. [Browser storage behavior](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria).

## Input contract and early experiment

`KeyboardEvent.code` identifies physical position, not the resulting character. Use it for physical-key effects and explicit EN/RU maps for virtual typing. Never infer a visible character by stripping a code prefix. [KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code).

Prove the following before expanding the editor:

- Selection in Edit versus activation in Play; editor controls never trigger playback.
- Selected EN/RU typing, cursor replacement, paste, composition, modifier behavior, and held text repeat without repeated audio. Proposed policy: map ordinary physical printable presses to the chosen app language only in the dedicated typing surface; preserve native composition/paste and command shortcuts. Verify text undo/caret behavior before adopting it. If P04 cannot be met, present the evidence for a product decision.
- Treat scratchpad/canvas typing, focused toolbar controls, and key-grid navigation as distinct contexts. Enter/Space activating a button must not also play a second key; Tab always advances/exits focus.
- Match down/up by source. A pointer and physical keyboard can hold the same key. Ignore repeat for sound, release each source once, and clear pressed state on blur, hidden page, cancellation, mode/layout/design change, and unmount. Cancellation must not generate a burst of release sounds.
- Use pointer capture where suitable; never rely on synthetic keyboard events to insert text. Missing physical codes degrade without guessing a wrong key; virtual input remains available.

Real touch/OS behavior needs device testing, not merely dispatched DOM events.

## Audio and media contract

Use one Web Audio engine per studio, enabled/resumed by user action. Decode/cache ahead of playback, create a source for each voice, apply assignment gain/pitch plus master gain, and dispose completed voices. Feed resolved assignments into the engine. Track random history per assignment/phase with a safe single-sample case. Bound voices/cache growth after measurement. [Web Audio guidance](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices).

Audio decoding needs complete file data; compressed size alone does not bound decoded memory. Check byte limits before reading/decoding, then duration/channels and image dimensions. Decode sequentially and cap retained buffers. Trim metadata may reference immutable originals, preserving undo; exports include required source data and trim metadata. [Audio decoding](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData).

The early experiment covers short/long, mono/stereo, malformed audio, large-dimension images, simultaneous voices, storage failures, and complete archives. Record browser/device, encoded/decoded sizes, decode time, responsiveness, and recovery. Derive supported formats and limits for upload bytes, duration, dimensions, pool size, voices, archive bytes, entry count, and total expanded bytes. Store limits in a single policy used by UI and validation. Numeric limits are not approved facts yet.

Bundled audio/fonts require redistribution rights compatible with self-contained exports. Record sources/licenses and include required notices in exports. All presets use ordinary schema/control capabilities.

## Portable file contract

Propose a `.keyboard-artist` ZIP with `manifest.json`, immutable media, and required notices. Use [`fflate`](https://github.com/101arrowz/fflate) for archives and a runtime schema such as [`Zod`](https://zod.dev/) for manifests; pin compatible versions when the relevant task adds them. Do not handwrite compression or validate by casting unknown data.

Include every referenced media dependency, including bundled sounds. Before import commits anything, validate archive size/count, paths/duplicates, actual expanded bytes, format version, supported key/layout IDs, numeric ranges, asset references, and decodability. Enforce expansion limits during reading, not just against declared metadata. Reject executable/HTML content, unsupported or animated image types, arbitrary CSS, and remote assets. Render legends/names as text.

After full validation, commit under a fresh ID in one transaction. Explicit replacement atomically changes only its chosen target; a failed replacement preserves that target. Reject unknown future versions clearly. Keep export-format versions separate from storage-schema versions.

## Surface plan

The editor is an Operate surface; the player is an Experience surface. T01 uses the confirmed brief with Impeccable/frontend-design to settle typography, semantic colors, spacing, focus treatment, and key materials, then records `DESIGN.md` and a studio surface brief. Preserve the agreed three-column topology. Do not invent a finished approved design system in this implementation plan.

Visible states: first preset, design/audio loading, no selection, mixed selected values, global/overridden settings, saving/saved/unsaved, empty library, failed upload/import, suspended audio, mute, and reduced motion. Inspector headings identify what an edit affects. Provide numeric/button alternatives to dragging trim handles or images.

On narrow screens show playback and a design picker, not squeezed inspectors. Preserve usable hit targets with a contained scrollable keyboard where necessary. Provide a separate scrolling affordance so captured pointers/multi-touch do not trap navigation. Keep focused keys visible. Test 320/768/1024/1440 CSS-pixel widths and 200% zoom; derive the editor breakpoint from minimum usable width.

## Delivery order

| Milestone | Tasks | Usable outcome |
| --- | --- | --- |
| M0 — Resolve expensive uncertainties | T01–T03 | Visual direction, browser test harness, input/audio/storage evidence and limits |
| M1 — One keyboard works | T04–T06 | 60% preset, physical/virtual input, Edit/Play, cursor editing, focus |
| M2 — A personal design survives | T07–T09 | Global/per-key controls, history, autosave/reload |
| M3 — Library and visual expression | T10–T12 | Named designs, layout/language switching, background media |
| M4 — Expressive playback | T13–T15 | Built-in press/release audio, assignment controls, reduced-motion effects |
| M5 — Users author sound | T16–T18 | Upload/trim/pools, undo of media changes, three presets |
| M6 — Designs travel safely | T19–T21 | Complete export/import/replacement and recovery journeys |
| M7 — Reviewable release | T22–T24 | Mobile, accessibility/performance evidence, isolated preview |

After contracts stabilize, effects/audio, preset preparation/library UI, and archive codec/mobile presentation can progress independently. Shared schemas, history, save coordination, and migrations must remain sequential. This describes dependencies, not an instruction to spawn parallel agents.

## Tests and commands

Current executable commands:

```sh
npm ci
npm run dev -- --host 127.0.0.1
npm run check
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

T02 introduces these scripts; they do not exist yet:

```sh
npm run test -- --run
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
```

Proposed tools: [Vitest](https://vitest.dev/guide/) for document rules/integration, [Svelte Testing Library](https://testing-library.com/docs/svelte-testing-library/intro/) for observable component behavior, and Playwright for actual input, IndexedDB, reload, and files. Add axe checks alongside manual focus/screen-reader/touch/audio checks. Add packages only in the task using them, selecting versions compatible with the installed toolchain.

Test inheritance, maps, trim arithmetic, and no-repeat selection as pure rules. Verify transactional saving and reload in a real browser, with injected failure through a storage boundary. Mocked AudioContext proves routing, not audible output or device latency. Use deterministic PCM fixtures for trim/volume/pitch checks and human listening on desktop/touch hardware. Avoid full-editor snapshots and tests that mirror internal calls.

Run `npx -y @sveltejs/mcp svelte-autofixer <path>` on changed Svelte components. Follow Impeccable's rendered review/detector after visual slices. Documentation-only changes do not need app tests or visual detection.

## Definition of done and release evidence

- Tasks meet focused acceptance checks; code/config changes pass `npm run check` and `npm run build`. Milestone checkpoints run accumulated tests and an integrated journey.
- Proposed browser coverage: stable Chrome/Edge, Firefox, Safari, plus real iOS Safari/Android Chrome playback. Record exact versions/devices. Playwright WebKit is not proof of Safari audio/touch.
- Round-trip a design with uploaded image, trimmed press/release samples, pools, per-key overrides, and hidden-layout keys. Compare settings and asset bytes, then verify fresh-session playback.
- Test blocked/full storage, stale saves/tab conflicts, invalid/oversized/future archives, missing media, decode errors, blur during a chord, and undo after media replacement. Existing designs survive rejected operations.
- Verify keyboard-only controls, names/states, focus, modal return focus, contrast in shipped editor/presets, no traps, zoom/reflow, non-drag alternatives, reduced motion, and audio enablement. User-authored colors must not obscure editor focus/labels.
- Capture repeatable cold-load and warm-play traces. Proposed starting targets on the recorded reference device: p95 handler-to-audio-scheduling below 10 ms, p95 event-to-visual-feedback below 50 ms in a representative chord run. Calibrate in T03; these are engineering targets, not results or acoustic-latency promises. Report decode/import memory and long tasks separately. Do not imply field-performance evidence from lab tests.
- Preview uses an isolated path/host. Inspect actual Pages/workflow settings before selecting deployment mechanics. Verify nested base paths for scripts/fonts/sounds/downloads; document release and rollback. Replace the original site only after explicit approval.

## Boundaries and remaining decisions

Preserve requirements, unrelated work, asset attribution, and saved data. Record evidence before proposing a scope change. Never add accounts/telemetry, transmit scratchpad text, install a service worker, or replace production implicitly.

Review this proposed plan before coding. M0 settles visual tokens, exact key inventories, input policy, formats/limits, device-test availability, and runtime budgets. Record unavailable device tests as gaps. No milestone is complete merely because it is described here.
