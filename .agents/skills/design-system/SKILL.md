---
name: design-system
description: Establishes and preserves consistent visual tokens, component rules, spacing, typography and interaction patterns across Konoha interfaces. Use when creating or extending reusable UI styles or multiple related screens/components.
---

# Design System

Avoid designing every screen from scratch.

## Establish tokens

Prefer a small, explicit token set for:

- typography
- spacing
- radius
- borders
- shadows
- colors
- component sizes

Example spacing scale:

4, 8, 12, 16, 24, 32, 48

Do not introduce arbitrary values such as 17, 23 and 31 px repeatedly unless measurement against a reference requires them.

## Typography

Define clear roles:

- display
- heading
- body
- caption
- label

Keep hierarchy consistent across related screens.

## Components

Standardize reusable patterns such as:

- card
- badge
- button
- avatar
- status pill
- section header
- empty state
- form field
- modal

When a component already exists, extend it rather than creating a visually similar duplicate.

## States

Each interactive component should consider:

- default
- hover
- active
- disabled
- loading
- error
- success

## Konoha consistency

Maintain a unified visual identity across:

- profile cards
- staff views
- customer views
- booking views
- ticket views
- generated graphics
- web dashboards

Role differences may change labels or accents, but should not create unrelated design languages.

## Change policy

When changing a token or shared component:

1. search all usages
2. assess visual regressions
3. update dependent views
4. run visual QA
5. document intentional exceptions
