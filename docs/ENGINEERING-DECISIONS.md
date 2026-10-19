# Engineering decisions and experiment evidence

2026-10-20. The approved plan is executing on `feature/keyboard-artist-v1`. Raw measurements: `docs/evidence/experiment-*.json`. Automated Chromium identifies itself as Chrome 156 on Windows in its user agent, despite the command host being macOS; treat it as the automation runtime, not evidence of this Mac's audio hardware.

## Input

Use physical `code` for identity, explicit EN/RU maps for ordinary printable input only on the keyboard canvas/scratchpad in Play. Native paste/composition remain untouched. Input/select/button/editor fields do not play. Browser/OS Ctrl/Meta/Alt combinations and Tab stay native. `execCommand(insertText/delete)` is a deliberately isolated deprecated browser editing API: the Chromium experiment verifies selection replacement and native text undo, which direct textarea value assignment loses. Cross-engine behavior must pass before claiming support. Source aggregation releases only after the last source; cancellation clears silently.

## Media and runtime policy

The Chromium fixture decoded 1/10/30-second stereo WAVs, MP3 and Ogg; a 10-second source retained 3.84 MB PCM in this 48kHz runtime. The 30-second fixture exceeded 11 MB decoded. A 4096² PNG decoded to 64 MiB. A 32 MiB blob committed and survived an aborted replacement. 32 simultaneous sources scheduled below 1ms in these runs. Raw times are single-run lab observations, not latency guarantees or field data.

Set conservative authoring bounds below the larger fixtures: audio 4 MiB source, 10 seconds, 2 channels, 8 MiB decoded per sample; WAV/MP3/Ogg only. Background PNG/JPEG (static), 8 MiB source, at most 4096 per dimension / 16 megapixels. Total referenced media 24 MiB, at most 64 assets, and at most 64 MiB aggregate decoded audio per design. The 48 kHz audio context and aggregate validation keep every assigned sample playable within the decoded cache; active samples are never silently evicted. Sample pools at most 8. Audio engine at most 32 voices, 64 MiB retained decoded buffers. Archives at most 32 MiB encoded and expanded, 96 entries, 512 KiB manifest. Enforce actual expanded bytes as they stream, including unknown ZIP sizes. Image headers checked before decode, then dimensions verified. Reject animated PNG, SVG, HTML, remote media, and unsupported codecs. Limits are a bounded product policy, not a promise that every device has this storage available.

Initial lab budgets retained: p95 input-handler to scheduling <10ms and event to next visual frame <50ms on the recorded automation runtime. These are neither acoustic latency nor real-device performance. Tune only from equivalent traces.

## Inventories

60%: 61 stable ANSI positions. Compact 75%: 83 positions, function row and navigation column/arrows. Full: 104 unique positions including numpad and navigation. Num Lock does not remap text; numpad number positions always type digits in the app. OS-reserved/meta/function positions highlight where delivered but do not synthesize OS actions. Layout switches preserve all keyed overrides, and inactive positions do not activate.

## Verification gaps

Firefox 157 downloaded but fails before page load with “Could not find profile folder”, including retry using `/tmp` and one worker. This is unavailable coverage, not a browser pass. WebKit 27.2 launches and passes core input, persistence, portability, recovery and axe journeys after the byte-storage fix below. Audio resume remains unavailable in this runtime. No physical iOS/Android device, Safari desktop listening, human listening, screen-reader session, or acoustic measurements have been performed. These remain release acceptance gaps; implementation may continue, but v1 must not be labeled fully verified.

## WebKit storage finding and fix

The environment probe reproduced native IndexedDB Blob failure (`Error preparing Blob/File data to be stored in object store`) while ArrayBuffer writes succeeded. Assets now persist as ArrayBuffers inside the same atomic transaction, with Blob reconstruction on load and compatibility with earlier development Blob records. Bytes are prepared before the transaction opens. A per-repository immutable-ID cache avoids rewriting unchanged media on every control adjustment. Pending document writes coalesce by ID while one transaction is in flight; revision checks remain at the transaction boundary. The resulting WebKit appearance/library/reload/media/recovery tests pass. Raw probe evidence is in `environment-webkit.json`.

## Storage retention

Media referenced by session history stays in memory and storage. This candidate deliberately performs no automatic asset garbage collection, so deleting a design does not immediately reclaim all media bytes. Quota failures remain visible and exportable; no other design is evicted to create space. A future collector must account for every design and all session history references.

## Tooling and review

Runtime additions: Zod (boundary validation), idb (transaction lifecycle), fflate (bounded ZIP streaming/encoding). All use permissive MIT licenses. Vitest/Playwright/axe and Prettier/Svelte formatter are development-only. `npm audit` found no known vulnerabilities at installation. Prettier formats application-owned files only; vendored skills are untouched. Svelte autofixer results are retained; plain Maps hold imperative service handles/immutable media and expose separate reactive snapshots, so their non-reactivity is intentional. Dialog `bind:this` is retained for native modal lifecycle.
