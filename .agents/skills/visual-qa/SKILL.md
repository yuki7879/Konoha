---
name: visual-qa
description: Performs screenshot-based visual verification after UI changes. Use after implementing or modifying frontend, cards, embeds, layouts or visual components to catch defects that code inspection cannot reveal.
---

# Visual QA

A visual change is not complete until the rendered result is inspected.

## Workflow

1. Run the project.
2. Open the affected view.
3. Capture a screenshot.
4. Inspect the screenshot.
5. Compare against requirements or reference.
6. Fix visible defects.
7. Capture again.
8. Report what was verified.

## Inspect for

- clipping
- overflow
- inconsistent padding
- uneven gaps
- text wrapping
- truncated labels
- broken images
- misaligned icons
- inconsistent radius
- unexpected scrollbars
- poor contrast
- overly dense areas
- empty awkward areas
- responsive breakage
- hover/focus/disabled states when relevant

## Interaction QA

For buttons, menus, modals and flows:

- verify initial state
- verify interaction state
- verify loading state
- verify success state
- verify error state

For Discord-like components, verify that labels are concise enough for the real surface.

## Evidence standard

Do not say "looks correct" without inspecting the rendered output.

When browser automation is available, prefer screenshot evidence and measured layout information over assumptions from source code.
