# Review candidate validation

Date: 2026-10-20. The approved scope is implemented through M7. This is a review candidate, not a claim that every acceptance item is complete. Unchecked tasks remain open where required real-device/browser evidence is unavailable.

## Executed checks

- `npm run test -- --run`: 12 rule/package tests pass, including schema/inheritance, Unicode cursor replacement, unique inventories, source overlap, coalesced history, no immediate sample repeat, bounded expansion, traversal/duplicate/truncated/future packages and missing media. Inverting the no-repeat rule makes its test fail; source restored. `evidence/mutation.txt` records this small mutation check, not a project-wide mutation score.
- `npm run check`: zero Svelte/TypeScript errors or warnings.
- `npm run build`: production build passes. Approximately 70 KiB gzip JavaScript and 3.1 KiB gzip CSS; original bundled audio adds about 42 KiB. This is bundle evidence, not field performance.
- Chromium: 31 browser tests pass. Raw run: `evidence/chromium-results.json`.
- WebKit 27.2: 26 non-audio/device-independent browser tests pass. Five audio/performance/CDP-only cases are deliberately excluded; exclusions are not passes. Raw run: `evidence/webkit-results.json`.
- axe: zero violations in each shipped preset editor and the mobile player in Chromium and WebKit. Reports: `evidence/axe-chromium.json`, `axe-webkit.json`. This is automated coverage, not WCAG certification or a screen-reader test.
- Svelte autofixer executed on every component/module. Reports: `evidence/autofixer/`. Plain Maps retain imperative service state, while separate reactive snapshots drive UI. Native modal `bind:this` is intentional. The one suppressed Svelte diagnostic concerns keyboard access to a scrollable region; its focus access is necessary.
- Impeccable detector: no mechanical findings. Finish reviewer found missing overflow guidance and incorrect Play placeholder; both scored resolved after correction. Direction provenance records the user's explicit authorization to infer ordinary choices. The reviewer shipped the scored fixes, not a claim of complete product acceptance. Token-bearing DESIGN.md and sidecar documented from source.

## Capability evidence

| Requirements | Working behavior and evidence | Remaining evidence |
| --- | --- | --- |
| P01, P05–P07 | Three-column studio; global controls; literal decorative legends; mixed/multi/group selection; inherited properties; fresh preset copies; `appearance.spec.ts` | None for tested desktop flows |
| P02, P04, P12 | Edit/Play boundaries, EN/RU maps, cursor replacement, native text undo, virtual Tab focus, held-repeat, Shift/Caps, temporary scratchpad; `input.spec.ts`, `mobile.spec.ts` | Real OS IME and clipboard workflow; only synthetic composition boundary is tested |
| P03 | 61/83/104 unique stable positions; full-size navigation/numpad geometry; hidden override restoration; `layouts.spec.ts`, rule tests | Physical numpad/modifier differences across OS/hardware |
| P08, P11, P14 | Validated image/sample upload, fit/position/dimming controls, trim numbers/sliders, media undo/reload; boundary rejections preserve prior work; `media.spec.ts` | Additional physical-device codec stress testing |
| P09 | Physical/glow/ripple; held highlighting; repeat suppression; reduced-motion substitution; screenshots and chord trace | Physical device motion/performance |
| P10 | Real Chromium Web Audio scheduling, overlap, one press/release despite repeat, octave pitch, mute, sample pool no-repeat rule; original PCM samples | Human audible output/quality, acoustic latency; WebKit audio resume, Firefox |
| P13 | Transactional byte storage; serialized/coalesced revisions; delayed edits; stale-tab conflict; injected quota failure retains export; `recovery.spec.ts` | Actual full disk/quota and browser eviction scenarios beyond injected failure |
| P15 | Versioned bounded ZIP, SHA-256 media integrity, renewed imported IDs, strict schemas, decode/trim checks, explicit replacement; clean-context round trip with image/trimmed sample | Fresh-session audible listening; Firefox round trip |
| P16 | 320/768/1024/1440 screenshots, intact scrollable arrangements, visible scroll controls/mute/exit, CDP two-touch Shift/cancel/Caps | Actual simultaneous physical touches, iOS/Android portrait/landscape |
| P17 | Semantic controls, names/states, focus rings, keyboard journeys, native confirmation dialog, reduced motion, axe in two engines | Screen reader, full manual contrast/focus and real browser zoom audit |
| P18 | Network disabled after load: edit/save/export pass; no server processing, external assets, account or service worker | Offline reopening intentionally deferred |
| P19 | Each preset is editable and restores after reload; global/per-key settings use the ordinary schema; asset provenance in ASSETS.md | Listening comparison on actual hardware |
| P20 | Isolated preview deployment and original-site preservation recorded in RELEASE.md | Production promotion requires explicit approval and acceptance gaps above |

## Public preview verification

At the nested public URL: Chromium 29 pass / 2 development-only skips; WebKit 25 pass / 1 development-only skip with five unsupported audio/performance/CDP cases excluded. Both browsers complete settings/media round trips at the deployed base path. Reports are `evidence/preview-*-results.json`. Original-site root hash and browser behavior are preserved; exact revisions and rollback are in RELEASE.md.

## Visual and performance evidence

Rendered captures are in `.impeccable/review/`, including desktop/mobile, 768/1024, full-size overflow, and WebKit captures. Keyboard controls scroll the preserved arrangement; they do not scale it into tiny touch targets. A 720px CSS viewport approximates layout reflow at 200% zoom on 1440px; it does not substitute for actual browser zoom or accessibility zoom.

`evidence/performance.json` records three fresh-context navigations and warm 4-key chords, with exact URL/browser/conditions. `evidence/chord-trace.json.gz` is a Chrome trace of that chord run. Budget: p95 handler-to-source scheduling <10ms; next-frame visual observation <50ms. These are synthetic lab timings, not input hardware latency, acoustic latency, field INP, or Core Web Vitals. There is no RUM/CrUX evidence for this new preview. Values and cold-navigation range belong to the recorded run, not a performance guarantee.

## Release blockers and known limits

1. Firefox 157 fails at launch (“Could not find profile folder”) even after download and a `/tmp`/single-worker retry; no Firefox behavior is claimed.
2. WebKit AudioContext remains suspended during user-activated resume in this runtime. The app times out with an explicit resume/output-device message. Non-audio WebKit journeys pass, including image/sample decode and transfer. This is not evidence of actual Safari listening.
3. No physical listening, iOS/Android multi-touch, screen-reader session, OS IME/clipboard workflow, or acoustic latency measurement was available. Do not close the corresponding task acceptance gates or promote production on these results.
4. Browser text insertion uses the deprecated `execCommand` editing bridge to preserve native text undo. Chromium/WebKit journeys pass; real IME and future browser compatibility still require validation.
5. Media is conservatively retained in IndexedDB after deletion to preserve other designs/history. This candidate has no automatic collector; quota errors remain visible/exportable. Storage is origin-local and browser-managed, so exported backups matter.

## Resume point

Implementation is present for all 24 tasks. Continue with unchecked acceptance items in `tasks/todo.md`: real audio/device/assistive-technology checks, Firefox environment verification, and the complete three-engine audible round trip. Do not restart discovery or silently mark these unavailable checks passed.

Final published Chromium lab run: p95 scheduling 0.70 ms; p95 next-frame observation 16.80 ms. Three fresh-context FCP observations: 116, 124, 120 ms (unthrottled automation; not field data).

## Reference-led redesign — 2026-10-20

The two user-supplied references replace the previous graphite visual direction. The redesign changes application chrome and new-preset defaults; existing stored designs and portable package contracts remain intact. No original-site replacement is authorized.

- Local Chromium: **32/32 pass** (`evidence/redesign-chromium.txt`). Local WebKit: **27/27 selected cases pass** (`evidence/redesign-webkit.txt`), with the same five unsupported audio/performance/CDP cases excluded. The additional case checks the live design-system page, interactive toggle, reflow and axe at desktop/mobile widths.
- Axe: zero violations for all three preset editor states, narrow player, and live design-system page in each tested engine. This is automated accessibility evidence, not screen-reader or physical device certification.
- Svelte check: zero errors/warnings; production multipage build passes. Svelte autofixer reports no issues in changed components; existing native-dialog `bind:this` suggestion retained intentionally. Full output: `evidence/redesign-svelte-autofixer.txt`.
- Visual captures: `.impeccable/review/` contains desktop 1440, mobile 320, 768/1024, full-size board, Play, and design-system desktop/mobile. Fixed wallpaper captures outside the original 900px viewport can show screenshot-only paint discontinuity; this does not establish a scrolling/device result.
- Design detector ran once on changed targets: 77 advisory mismatches against the superseded DESIGN.md (12 color, 46 font-size, 19 radius), zero non-advisory findings. Raw output: `design/detector-redesign.json`. Reconciliation follows the finish review; no clean-detector rerun is claimed.
- Current build adds a 19.7 kB wallpaper and locally served Manrope font subsets; these are application chrome and are excluded from design exports. JavaScript/CSS bundle measurements in the earlier section belong to the earlier build. Current `dist/` output is the build evidence; no field-performance improvement is claimed.
- All prior T06/T13/T21/T22/T23 physical IME/clipboard, actual audible playback, Firefox runtime, touch/zoom and assistive-technology gaps remain open.

Post-review checks: the six Chromium/WebKit visual/accessibility cases pass after the showcase typography/label corrections (`evidence/redesign-final-visual.txt`). A focused real Chromium Web Audio regression also verifies dock bar heights during a held key, release and muted hold (`evidence/redesign-dock.txt`); this proves input-linked visual feedback and scheduling behavior, not audible output or a waveform analyzer.

Fresh visual reviewer disposition: **ship for the three scored corrections** (persistence, removed decorative labels, title tracking), with all eight rewritten captures valid and no visible fix-batch regression. The documenter validated source-backed DESIGN.md tokens and `.impeccable/design.json` metadata/reference/narrative consistency. Reports: `design/finish-review-redesign.md`, `design/implementation-review.md`. This is not a new whole-surface acceptance certification.
