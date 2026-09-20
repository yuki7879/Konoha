---
name: pixel-perfect-ui
description: Measures and corrects UI geometry with pixel-level precision using rendered DOM metrics, screenshots and design references. Use when exact spacing, sizing, alignment, responsive layout or reference matching matters.
---

# Pixel Perfect UI

Measure before guessing.

## Required behavior

When a browser or rendered UI is available, use actual geometry rather than visual approximation.

Useful measurements include:

- width and height
- x and y position
- padding
- margin
- gap
- line-height
- border radius
- text container width
- image/avatar dimensions

Use DOM geometry such as getBoundingClientRect() when available.

## Comparison method

Record:

- expected value
- actual value
- delta

Example:

expected width: 320 px
actual width: 318 px
delta: -2 px

Use a practical tolerance unless exact equality is required:

- position: ±1 px
- size: ±1 px
- spacing: ±2 px

## Reference matching

When matching a reference image or existing design:

1. identify stable anchors
2. match outer frame first
3. match large regions
4. match typography blocks
5. match component spacing
6. match small decorations last

Never tune small icons before the main layout geometry is correct.

## Responsive checks

Inspect at least the relevant target viewport and one narrower viewport when responsive behavior matters.

Check for:

- wrapping
- clipping
- overflow
- collapsed spacing
- misaligned controls
- fixed-width elements breaking layout

## Numeric discipline

Do not invent pixel values because they "look right."

When exact measurement is impossible, state that the value is an estimate and keep the estimate separate from verified dimensions.
