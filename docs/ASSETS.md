# Assets and redistribution

Built-in samples are deterministic short PCM WAV fixtures authored in this repository by the sample-generation script (noise transients and decaying tones); they are rendered assets, not a user-facing synthesizer. They contain no third-party recordings. Included original samples may be redistributed with exported designs. System font stacks use locally installed fonts and embed no font bytes. User-uploaded assets remain local; users are responsible for rights to their own media. Exports include this notice.

## Studio chrome (2026-10-20 redesign)

- `src/assets/studio-dusk.webp`: original AI-generated photographic dusk landscape, generated for this project using image_gen and converted to WebP. Exact prompt is embedded in the WebP and recorded in its `.json` sidecar. It is decorative interface wallpaper, not a real-location claim or approved UI comp. Neither supplied reference screenshot is redistributed.
- Manrope Variable: self-hosted through `@fontsource-variable/manrope`, licensed under SIL Open Font License 1.1 (redistributed license in `public/manrope-license.txt`). Manrope is interface chrome; keyboard fonts remain document controlled.
- UI icons: original simple geometric SVG paths in `src/lib/ui/Icon.svelte`.

Wallpaper and interface font are excluded from portable design exports. The starting Tactile preset now uses dark caps and rose accents; existing saved designs retain their authored palette.
