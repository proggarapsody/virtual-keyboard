---
name: Keyboard Artist
description: A quiet graphite workspace for an expressive keyboard.
colors:
  chrome: "#181b20"
  surface: "#20242b"
  border: "#3c434e"
  text: "#f1f3f5"
  muted: "#b4bdc9"
  action: "#a9c8ff"
  control: "#292e37"
  control-hover: "#373e49"
  primary: "#b7cfff"
  primary-ink: "#172a49"
  focus: "#ffffff"
  focus-underlay: "#12161c"
  selected: "#333c4c"
  selected-border: "#7f9ac3"
  error: "#4c2a2e"
  error-text: "#ffe0e3"
typography:
  title:
    fontFamily: "system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    letterSpacing: "-.025em"
  brand:
    fontFamily: "system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 650
    letterSpacing: "-.03em"
  section:
    fontFamily: "system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 650
  body:
    fontFamily: "system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
  description:
    fontFamily: "system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
  key:
    fontFamily: "system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 400
rounded:
  swatch: "4px"
  control: "6px"
  scratchpad: "8px"
  stage: "12px"
spacing:
  step-4: "4px"
  step-6: "6px"
  step-8: "8px"
  step-12: "12px"
  step-16: "16px"
  step-18: "18px"
  step-24: "24px"
  step-32: "32px"
components:
  button-default:
    backgroundColor: "{colors.control}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "7px 10px"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.control}"
    padding: "7px 10px"
  input:
    backgroundColor: "{colors.control}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "7px 10px"
  scratchpad:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.scratchpad}"
    padding: "18px"
  library-active:
    backgroundColor: "{colors.selected}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "7px 10px"
---

# Design System: Keyboard Artist

## Overview

**Creative North Star: "A quiet graphite workspace"**

The editor surrounds an expressive keyboard with subdued, functional chrome. Dense controls and explicit status text support repeated editing; the keyboard carries the color, material, and press response. This is a code-led record of the implemented system, with ordinary visual choices inferred under the user's authorization.

The editor is an Operate surface and the player is an Experience surface. Player mode removes the side inspectors and keeps the keyboard, scratchpad, and listening controls. Background images are supplied by the user; the interface uses system fonts and requires no remote UI assets.

**Key Characteristics:**
- Graphite chrome with restrained blue actions and readable neutral text.
- Compact editing controls around a physically proportioned keyboard.
- Sculpted keycaps, explicit selection, and motion that responds to input.

**Workflow provenance.** The user's direct implementation instruction takes precedence over repeating the design selection ceremony: “Resolve ordinary engineering choices autonomously” and “Ask only when a finding requires changing confirmed scope or when an explicitly required design decision cannot be inferred from the approved brief.” The confirmed brief fixes the dark editor and three-column topology. Concrete tokens were inferred and disclosed before UI construction. No concept seed or generated comp was used; neither is claimed as approved evidence. This is the explicit workflow exception for this code-led implementation.

## Colors

The palette separates durable application chrome from editable keyboard colors. Frontmatter values describe the implemented chrome; authored colors and presets are document content.

### Primary

- **Pale blue action:** primary buttons and text caret use `primary`; `primary-ink` supplies their dark text.
- **Soft blue accent:** `action` is the selection-highlight color. Keyboard effect accents remain editable per design.

### Neutral

- **Graphite:** `chrome` grounds the page; `surface` distinguishes the library, inspector, scratchpad, and scroll controls.
- **Control gray:** `control` and `control-hover` distinguish interactive fields and button hover; `border` provides visible boundaries.
- **Reading neutrals:** `text` carries primary content and `muted` carries labels and supporting copy.
- **Selection neutrals:** `selected` and `selected-border` identify the current library item. `focus` and `focus-underlay` provide the independent light/dark focus treatment.
- **Error pair:** `error` and `error-text` distinguish visible failure messages.

**The Authored Color Rule.** Keep chrome tokens separate from document-controlled keyboard, page, legend, and effect colors.

## Typography

**Body and interface font:** system sans, using the frontmatter stack. This is functional editing typography, not a display-brand face. Keyboard designs can choose system sans, Georgia with serif fallback, or system monospace with monospace fallback.

### Hierarchy

- **Title:** canvas heading; contracts on narrower screens.
- **Brand:** compact application name with a smaller supporting line on desktop.
- **Section:** library, scratchpad, and inspector section titles.
- **Body:** inherited control text and scratchpad text; scratchpad line height is 1.6.
- **Description:** supporting paragraphs, using the recorded line height.
- **Label:** inspector labels, status, and compact toolbar text.
- **Key:** keyboard legends; font family follows the authored design.

## Layout

The desktop editor uses a three-column grid: a 200px library, flexible central workspace, and 270px inspector. The header spans the grid. Main padding is 32px vertically and 24px horizontally; side panels use 24px vertically and 18px horizontally. The canvas precedes the scratchpad, with supporting controls between them.

Below 1100px, side panels disappear and the player leads. Local design and preset selectors, portable-design disclosure, and explicit desktop-editing guidance appear above the canvas. Main padding becomes 24px by 16px. Below 481px, the heading wraps and supporting metadata contracts. Player mode uses a single column and centers main content within 1440px.

Keyboard geometry retains physical proportions inside a focusable horizontal viewport. Overflow reveals visible Scroll left and Scroll right controls and reachability guidance; keyboard focus also permits native scrolling. Full-size boards retain the main cluster, navigation cluster, arrows, and numeric pad at their document positions. At 1550px and above, key units and height increase from 38px/43px to 45px/49px; narrow screens use a 44px key height. Layout uses the spacing steps recorded above rather than a uniform card grid.

## Elevation & Depth

Chrome uses flat tonal layers and thin borders. Depth belongs to the authored keyboard: a diffuse shadow seats the board, and inset plus cast shadows give caps a sculpted face. Physical presses shorten the cap shadow and displace the cap; glow and ripple are alternative authored effects. Exact shadows and motion live in the sidecar.

Focus uses a white outline over a dark underlay so it remains visible independently of authored colors. Reduced motion removes transitions and animations and replaces physical displacement with an accent outline.

## Shapes

Controls use the control radius; scratchpad and stage use their respective frontmatter radii. Preset swatches are small rounded squares. Keyboard radius and gap are editable document values: the three starting designs use radius/gap pairs of 7/6, 4/5, and 10/7 pixels. These are presets, not a fixed chrome scale. Borders organize inspectors and disclosures; a scrim separates the confirmation dialog from the workspace.

## Components

### Buttons

Compact, legible controls use the default control surface, thin border, and frontmatter padding. Primary actions use pale blue with dark text and a heavier weight. Default button hover changes the surface; primary fill remains stable. Disabled buttons reduce opacity to one half. All controls use the independent focus treatment.

### Inputs / Fields

Inputs and selectors share the button geometry and fill the available inspector width. Labels sit above fields with a small gap. Scratchpad is a larger resizable text area, with the surface fill and more generous padding. Mixed values read “Mixed”; missing key overrides read “Inherited”.

### Navigation

The design library uses full-width text-aligned buttons, with transparent resting fill and border. The current design gets the selected surface and selected border. Preset buttons pair text with small two-color swatches. Narrow-screen navigation uses native selectors in the mobile picker.

### Containers

The library and inspector are continuous panels, not decorative cards. Inspector disclosures use top dividers and compact headings. The dialog uses the stage radius and surface color with a stronger border and backdrop scrim. Failure messages use the error pair and allow recovery controls to wrap.

### Keyboard

The recessed board carries sculpted caps and inset legends. Selected keys show a check mark and light outline with dark underlay; pressed and Caps Lock states are distinct. Physical, glow, and ripple effects are document choices. Touch input supports held keys; users scroll the space around the keyboard. The default warm mechanical, pale minimalist, and plum/pastel color-study presets are editable starting points.

## Do's and Don'ts

### Do:

- **Do** keep expressive color and material on the keyboard while using quiet chrome around it.
- **Do** preserve physical keyboard geometry and provide visible controls when it overflows.
- **Do** retain the independent light/dark focus treatment and explicit selection text or marks.
- **Do** honor reduced motion and show editing, save, and error states with readable text.

### Don't:

- **Don't** replace editable keyboard values with fixed chrome tokens.
- **Don't** use color alone to distinguish selected keys.
- **Don't** add remote UI fonts or image dependencies to the existing system-font chrome.
