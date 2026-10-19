# Keyboard Artist — confirmed v1 scope

Status: confirmed by the user on 2026-10-20 after the grilling interview (Q1–Q49). This is the product source of truth. The [implementation plan](../tasks/plan.md) contains proposed engineering choices; the [task list](../tasks/todo.md) tracks delivery. Discovery is complete. Feature implementation has not started.

## Positioning

A browser-based studio for people who enjoy personalizing how a virtual keyboard looks, sounds, and reacts while they type. Success is a design that feels recognizably their own and survives saving, reloading, exporting, and importing.

The core journey is **open a playable preset → customize → play → reload → export → import**.

## Operating context

- Svelte web application, desktop-first editing, smaller mobile playback experience.
- Typing happens inside the app; system-wide typing capture is outside v1.
- No account or server processing; designs and media live locally in the browser.
- English interface initially, with English and Russian typing layouts. Organize interface text for later translation.
- One restrained dark editor theme surrounds a separately customizable keyboard and canvas.

## Product principles

- Let the keyboard provide the expression; keep the editor precise and quiet.
- Make a complete preset playable immediately, without mandatory onboarding.
- Global settings provide defaults; individual overrides remain explicit and reversible.
- Preserve work when saving, importing, or changing presets fails.
- Keyboard access, visible focus, reduced motion, and accessible mute are part of the experience.

## Confirmed requirements

### P01 — First visit and workspace

Open with a complete playable preset. Put designs/presets in the left sidebar, the keyboard canvas centrally, settings in the right inspector, and a scratchpad below. Users can modify the initial design or switch presets without an onboarding flow.

### P02 — Edit and Play

In Edit, clicks select keys; an explicit preview action auditions sounds. In Play, physical and virtual keys operate the keyboard. Typing in editor fields never triggers keyboard effects. Distraction-free Play offers an optional scratchpad and a small exit/language/mute toolbar. Preserve browser/OS shortcuts and always provide a visible exit.

### P03 — Physical layouts

Provide fixed ANSI 60%, 75%, and full-size arrangements. Users customize appearance and behavior, not positions. Size changes preserve settings for disappearing keys; those keys stay inactive until restored. No arbitrary layout editor.

### P04 — Languages, legends, and text

Support English and Russian typing. Visual and sound assignments follow physical positions across language changes. Custom legends are decorative: a sun symbol does not redefine output. No macros or custom text-output mappings.

Virtual keys insert at the scratchpad cursor and replace selected text. Support Backspace, Enter, Shift, and Caps Lock. Tab moves focus rather than inserting indentation. Text can repeat while a key is held even though sound and press effects trigger only once.

### P05 — Global visuals

Provide global colors, curated fonts, key corner radius, spacing, keyboard background, and page background. Fonts and geometry are global. Editor chrome is independent of design appearance and excluded from exported designs. Arbitrary CSS and custom key shapes are outside v1.

### P06 — Per-key controls and selection

Per-key visual overrides cover colors and legend text; audio overrides are in P10. Click selects one key, Shift-click selects multiple, and group actions select letters, modifiers, or function keys. Groups select keys rather than creating persistent styling rules. No per-key images, fonts, geometry, or press-effect settings.

### P07 — Inheritance and presets

Global changes affect properties without overrides. Offer an explicit reset of selected keys to global settings. Choosing a preset creates a fresh design so previous work remains recoverable. Presets use ordinary editor capabilities, not special rendering unavailable to users.

### P08 — Background images

Upload, replace, remove, position, and dim a background image; choose fit or fill. No cropping suite, filters, or animated backgrounds.

### P09 — Press effects

Offer physical press, glow, and ripple with a few global controls. Respect reduced-motion preferences. Trigger once per physical press, not on repeated keydown events; held-key highlighting remains until release.

### P10 — Sound playback and assignment

Provide built-in sound packs and uploaded samples. Support separate press/release assignments globally and per key. Keys inherit global assignments until overridden. Each assignment has volume and pitch; also provide master volume and always-accessible mute.

Assignments may have a small sample pool. Choose randomly without immediately repeating the same sample when multiple samples exist. Multiple keys can sound together. Produce one press and one release trigger per press lifecycle. Audio requires an explicit Enable sound action before first playback.

### P11 — Sound preparation

Include sample trimming, auditioning, volume, and pitch. Treat uploads as short sound sources, not a recording library. Show upload/design limits before file selection. Choose exact source-size, clip-duration, and total-design limits through storage/playback testing.

No recording, synthesizer, audio effects suite, or multitrack editor.

### P12 — Scratchpad

Provide a temporary scratchpad with a clear action and an option to hide it in Play. Text is neither persisted across reloads nor exported. No saved documents, statistics, scores, or speed tests.

### P13 — Library and saving

Maintain a local library of named designs, support duplication, and autosave the active design and its media. If saving fails, retain current work in memory, visibly mark it unsaved, and offer export immediately. Never silently discard media or overwrite another design to make space.

### P14 — Undo and deletion

Session undo/redo covers active-design settings, sound assignments, and media changes. Standard undo/redo shortcuts operate in Edit; text fields retain ordinary editing. Confirm design deletion separately. Library operations and persistent undo history are outside the agreed undo scope.

### P15 — Portable designs

Export one self-contained, versioned file with settings and required media. Import creates a new local design; replacement requires an explicit action. Reject damaged, invalid, or unsupported files clearly while preserving existing work. Exclude scratchpad text and editor chrome.

### P16 — Mobile playback

Phones support presets, opening local/imported designs, playback, and master volume. Full editing stays on desktop. Support simultaneous touches, held-key highlighting, held Shift, and persistent Caps Lock. Preserve the selected physical arrangement rather than silently rearranging it.

### P17 — Accessibility

Essential controls are keyboard-accessible with visible focus. Respect reduced motion and browser/OS shortcuts. Provide explicit audio enablement and accessible mute. Selection and important states must not depend only on color or sound.

### P18 — Local operation

After the app and required assets load, editing, playback, and export work locally without accounts or server processing. Guaranteed offline reopening, app installation, and cross-device synchronization are deferred.

### P19 — Included presets

Ship three coherent editable presets: tactile mechanical, quiet minimalist, and colorful audiovisual. Each demonstrates something reproducible through the editor, including sound assignments and press effects.

### P20 — Preview and release

Publish a separate preview and verify create → customize → play → reload → export → import before replacing the original site. Replacement requires explicit user approval. Public galleries, profiles, hosted share links, recording, and video export are outside v1.

## Evidence on hand

Original repository: [proggarapsody/virtual-keyboard](https://github.com/proggarapsody/virtual-keyboard). Its `dev` branch holds the legacy vanilla JavaScript/Webpack/Sass app; `gh-pages` holds the published build. Prior inspection found EN/RU layouts, physical highlighting, virtual typing, three themes, language/theme persistence, and no audio engine.

The current foundation has Svelte 5, TypeScript, Vite, and nine project-local skills. The UI is still the Vite starter. Starter checks/builds prove setup, not implementation of these requirements.

## Remaining engineering decisions

Browser coverage, media formats/limits, exact key inventories, visual tokens, storage/package schemas, and runtime budgets are engineering work in the plan. If experiments require reducing a confirmed capability, present evidence and a proposed scope change rather than silently weakening this document.
