---
name: Keyboard Artist
description: A smoked-glass keyboard workbench in rose and lavender dusk.
colors:
  text-primary: "#f7f2f7"
  text-secondary: "#d2c8d5"
  text-muted: "#b9adbf"
  surface-glass: "rgb(42 36 46 / 83%)"
  surface-raised: "rgb(255 255 255 / 7%)"
  surface-inset: "rgb(12 10 17 / 34%)"
  surface-control: "#49404e"
  line-subtle: "rgb(255 255 255 / 12%)"
  line-strong: "rgb(255 255 255 / 24%)"
  accent: "#e7b6c8"
  accent-ink: "#33232e"
  success: "#b9dbca"
  danger: "#ffb7b2"
  focus: "#f2d4e3"
  primary-ink: "#2c2531"
  primary-hover: "#ecd5e1"
typography:
  display:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "clamp(30px, 5vw, 48px)"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "23px"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.8px"
  title-narrow:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "20px"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.8px"
  brand:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.55
    letterSpacing: "-0.5px"
  section:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "13px"
    fontWeight: 650
    lineHeight: 1.55
    letterSpacing: "-0.15px"
  body:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  support:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  metadata:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "9px"
    fontWeight: 450
    lineHeight: 1.55
    letterSpacing: "normal"
  micro:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "8px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
rounded:
  panel: "24px"
  field: "11px"
  control: "999px"
  item: "14px"
  canvas: "18px"
  dock: "21px"
spacing:
  space-1: "4px"
  space-2: "8px"
  space-3: "12px"
  space-4: "16px"
  space-5: "20px"
  space-6: "24px"
  space-8: "32px"
components:
  button-secondary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.control}"
    padding: "8px 13px"
  button-primary:
    backgroundColor: "{colors.text-primary}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.control}"
    padding: "8px 13px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.primary-ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.control}"
    padding: "8px 13px"
  input:
    backgroundColor: "{colors.surface-inset}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.field}"
    padding: "10px 11px"
  glass-panel:
    backgroundColor: "{colors.surface-glass}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.panel}"
  library-active:
    backgroundColor: "rgb(255 255 255 / 9%)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.item}"
    padding: "11px 8px"
  listening-dock:
    backgroundColor: "rgb(16 12 21 / 65%)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.dock}"
    padding: "9px 12px"
---
# Design System: Keyboard Artist

## Overview

**Creative North Star: "A smoked-glass keyboard workbench at dusk"**

A personal keyboard workbench made of smoked glass and tactile caps. Rose and lavender landscape light sits behind dark translucent panels; soft white actions and restrained rose feedback keep the editor legible. Compact Manrope chrome frames a keyboard whose colors, fonts, sound, and press effects belong to its author.

The application is an operating surface: the keyboard remains the central object. Continuous library and inspector panels support editing; Play removes both sidebars. A locally bundled landscape and font supply the atmosphere without remote asset requests.

**Key Characteristics:**
- Smoked translucent panels over original dusk landscape light.
- Soft white pill actions, rose accents, and compact Manrope typography.
- Sculpted keyboard depth with selection and input-driven feedback.

**Authority and provenance.** The user's two pinned images and [redesign contract](docs/design/REDESIGN.md) on 2026-10-20 explicitly replace the former flat graphite/blue/system-font identity. They establish a replacement world, not a request to refresh the old palette. This record reconciles that authority with the implemented code; the frontmatter is normative and the sidecar extends it. The user-pinned direction supersedes the concept lottery and interview. Seed was attempted but refused because the launcher did not discover the existing docs/PRODUCT.md, which was read directly. No seed or generated UI-comp approval is claimed; the generated landscape is a project asset, not an approved UI comp. [PRODUCT.md](docs/PRODUCT.md) remains product authority.

## Colors

A low-chroma plum-neutral material family carries near-white content, rose interaction accents, and explicit success and danger signals. Frontmatter preserves the CSS source formats, including translucent rgb values.

### Primary

- **Soft white action:** text-primary fills primary buttons; primary-ink supplies dark text and primary-hover the warm hover tint.
- **Dusk rose:** accent colors range inputs, checkboxes, text selection, carets, and small interface icons. Accent-ink keeps selection text readable.

### Secondary

- **Soft mint:** success identifies local-save reassurance.
- **Warm coral:** danger identifies failure borders; failures also include readable text and recovery actions.

### Neutral

- **Smoked plum glass:** surface-glass supplies continuous panels; surface-raised supplies buttons and selected mode treatment; surface-inset recesses fields and segmented navigation. Surface-control is an available shared material token, not the default field fill.
- **Reading neutrals:** text-primary, text-secondary, and text-muted distinguish content, labels, and supporting information.
- **Luminous seams:** line-subtle and line-strong define boundaries without replacing the backdrop material. Focus is an independent pale rose outline.

**The Authored Color Rule.** Keep interface materials separate from authored keyboard, canvas, legend, and effect values. Chrome and studio wallpaper never enter portable designs.

## Typography

**Display and interface font:** locally bundled Manrope Variable with sans-serif fallback. Its soft geometry and variable weights support both the compact tool and the larger design-system demonstration. The interface has no separate mono-label system; code samples use the browser's code face.

### Hierarchy

- **Display:** the design-system introduction only, using the responsive frontmatter clamp and restrained tracking. It is not a studio marketing hero.
- **Title / narrow title:** canvas heading, contracting at the phone breakpoint; the brand uses its separate heavier role.
- **Section:** panel headings; shelf and showcase section headings use the body-sized tier.
- **Body / label:** default controls and text, then inspector labels. Supporting showcase paragraphs may use the section-size tier without its heading weight.
- **Support / metadata / micro:** compact help, save status, preset descriptions, and listening labels. These record observed density, not a requirement to shrink all supporting text. Eight-pixel text is confined to existing secondary metadata; essential actions retain full controls and accessible names. Metadata weights vary by context (400–450); headings and action labels use 600–700.
- **Exceptions:** dialog headings use 19px; the brand contracts to 14px below the desktop editor breakpoint. Authored key legends use 10px, selection marks 8px, and Caps Lock marks 7px with the authored font. These are object annotations, not the chrome reading scale.

**The Two Type Domains Rule.** Use Manrope for interface chrome. Keyboard legends retain the selectable authored font; do not export the interface font as a design setting.

## Layout

The studio is a bounded desktop grid (maximum 1840px): 224px library, flexible center, 272px inspector, with 24px outer padding and 20px gaps. The floating header spans the columns. Side panels remain continuous and sticky; the inspector scrolls internally. At widths from 1100px through 1300px, columns contract to 205px and 245px with 20px padding and 16px gaps.

At 1099px and below, the sidebars disappear, the layout becomes one column (maximum 950px), and native design/preset selectors plus portable-design controls support playback. At 700px and below, outer padding becomes 12px, the header wraps, and listening volume moves onto its own row. Play centers the main workspace within 1200px and removes inspectors.

The shared spacing rhythm is recorded in frontmatter. Components also have deliberate compact insets outside that scale: fields, library rows, and the listening dock own their exact geometry. Reuse those components instead of generalizing every one-off measurement into a token.

The keyboard preserves physical proportions inside a focusable horizontal scroller with visible scroll controls. Key units/heights are 38px/43px, increasing to 45px/49px at 1700px; at 600px and below, height becomes 44px. Full-size clusters retain their authored positions. The showcase is a separate 1000px demonstration column with 32px panel padding; at 600px and below its field/preset grids stack.

## Elevation & Depth

Depth is part of the approved material world. Glass combines a dark translucent fill, fine border, diffuse panel shadow, a subtle inset highlight, and blur with saturation. A solid plum fallback supports browsers without backdrop filtering. The landscape remains behind the entire chrome surface; authored canvas images are separate.

### Shadow Vocabulary

- **Panel:** shared shadow-panel supplies `0 18px 50px rgb(17 10 25 / 20%), inset 0 1px 0 rgb(255 255 255 / 7%)`; glass uses `blur(28px) saturate(115%)`.
- **Board:** a stepped diffuse base plus inset rim anchors the authored keyboard.
- **Cap:** inset top light, recessed lower face, and a small cast shadow provide a tactile shape. Physical press shortens the shadow; glow and ripple are authored alternatives.

**The Material Depth Rule.** Use diffuse cast shadows, fine luminous rims, and backdrop blur for glass. Reserve keycap displacement for actual input feedback.

Focus uses a 2px pale rose outline with 4px offset (fields 3px). Key selection has its own white outline, dark underlay, and check mark. Interface feedback lasts 160ms; keyboard duration is authored. Reduced motion shortens animations/transitions and removes physical key displacement while retaining an outline. Listening bars change only with held input while sound runs; they do not measure audio output.

## Shapes

The reusable geometry tokens distinguish generous glass panels, recessed fields, pill controls, library rows, canvas, and listening dock. The same radius is not applied indiscriminately: mobile panels contract to 22px, the mobile canvas to 15px, and the listening dock to the canvas tier. Preset containers use the canvas tier on desktop and item tier on phones. Color wells and preview keys have smaller local corners.

Authored cap radius and gap remain document settings. Keyboard board geometry and miniature preset boards belong to their components, not the chrome radius scale. Fine borders and continuous disclosure dividers organize dense settings; shadows describe material rather than hard offset decoration.

## Components

### Buttons

Soft pills use the shared Button primitive with secondary, primary, and ghost variants. The default minimum height is 36px, weight 600, and a subtle border. Secondary hover strengthens the fill and border; active fill strengthens again. Primary uses soft white with dark text and a warm hover tint; ghost rests transparent. Compact icon actions are 36px squares with the pill radius. Disabled opacity is 0.4. Inspector utility rows use their existing compact 30–32px variants.

### Inputs / Fields

Recessed full-width fields share the field radius, subtle border, and frontmatter padding. Selects have a 38px minimum height and dark option surfaces. Placeholder text uses text-muted. Native range and checkbox accents use dusk rose; color controls remain native wells. Labels sit above fields with a 7px gap. Scratchpad remains a resizable temporary writing area with 12px text and 1.7 line height. “Mixed” and “Inherited” describe actual settings states.

### Navigation

The header mode switch is an inset pill enclosure; active Edit uses the raised fill and Play uses the primary action. Library rows are full-width, text-aligned controls with a miniature design symbol; the active row gains a translucent fill, seam, and check icon. Native selectors replace the side library on narrow screens.

### Cards / Containers

Glass panels share material, border, shadow, and radius. Library and inspector use 20px by 17px padding; the workbench uses 23px. Disclosure groups keep a fine top rule instead of separate floating cards. Preset tiles are actual compact keyboard previews with captions, not interchangeable dashboard cards. The confirmation dialog uses an opaque plum surface, shared panel geometry, strong border, and blurred scrim. Failure banners show coral borders, readable text, and wrapping recovery actions.

### Listening dock and keyboard

An inset compact dock connects Enable sound, master volume, and persistent mute. Its white bars are input feedback; mute has explicit pressed state and text. The keyboard uses authored font/color/geometry, sculpted caps, and distinct selected/pressed/Caps Lock states. SVG icons use a 24-unit viewBox, rounded strokes, and 1.7 stroke weight, usually rendered at 15–18px; icon-only actions have accessible names.

## Do's and Don'ts

### Do:

- **Do** use the shared semantic tokens and reusable controls on both the studio and design-system page.
- **Do** preserve physical keyboard proportions and expose scrolling when the board overflows.
- **Do** retain visible focus, explicit selection marks, save/error text, and reduced-motion behavior.
- **Do** derive preset previews from the actual editable presets.

### Don't:

- **Don't** merge authored colors, fonts, or geometry into editor chrome.
- **Don't** replace continuous inspectors with a grid of decorative cards.
- **Don't** add marketing eyebrows or decorative numbered section prefixes.
- **Don't** describe the input-driven listening bars as an audio analyzer.

**Not canonized.** The former graphite token mismatches in the existing detector report are advisory evidence against the superseded system, not a reason to preserve old tokens or suppress findings. Removed showcase eyebrows, decorative numbering, and excessive title tracking are not system rules. Browser automation cannot settle physical audio/touch behavior, device/IME handling, Firefox, or screen-reader quality; those validation gaps remain open.
