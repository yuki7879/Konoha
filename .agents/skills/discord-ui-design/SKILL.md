---
name: discord-ui-design
description: Designs polished Discord embeds, buttons, select menus, modals, tickets, booking cards and operational messages with strong hierarchy and minimal clutter. Use for any Discord-facing UI or interaction flow.
---

# Discord UI Design

Design for Discord's actual interaction surfaces, not for a generic web app.

## Principles

- one primary purpose per message
- clear visual hierarchy
- minimal text
- limited button count
- consistent labels
- predictable interaction flow
- avoid unnecessary decoration

## Embeds

Use:

- concise title
- short description
- fields only when they improve scanning
- footer for secondary metadata
- consistent color conventions

Avoid:

- ten or more fields without strong reason
- paragraph-heavy descriptions
- multiple competing CTAs
- random emoji families
- decorative separators that consume space

## Buttons

Buttons should represent actions.

Prefer:
- Book
- Nhận đơn
- Xác nhận
- Hủy
- Đóng ticket

Avoid vague labels such as:
- Tiếp tục nào
- Bấm vào đây
- Xem thêm nhé

Use danger styling only for destructive actions.

## Select menus

Use when choosing among several structured options.

Do not use a select menu when two clear buttons would be simpler.

## Modals

Keep form fields focused.

- ask only for information needed for the next step
- provide short labels
- use placeholders as examples, not instructions essays
- validate required fields

## Booking UI

A booking card should make these immediately visible when relevant:

- service
- customer
- requested performer or generic request
- price/rate
- status
- creation time
- actionable next step

Do not overload the card with internal metadata.

## Ticket UI

Booking, Apply and Support should feel related but distinguishable.

A user should understand the next action within a few seconds.

## Style consistency

Use the same terminology, button labels, status names and visual conventions throughout the server.

Theme should feel Konoha-inspired without sacrificing clarity.
