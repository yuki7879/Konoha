---
name: konoha-project-context
description: Provides the domain model, naming conventions, roles, channels and product requirements for the Konoha Booking Discord project. Use when planning, implementing or changing any Konoha feature, command, interaction, database model, role, channel or user flow.
---

# Konoha Project Context

Use this skill as the source of truth for project-specific behavior unless the repository contains a newer explicit specification.

## Product

Konoha Booking is a Konoha-inspired Discord booking server for services such as chatting, venting, tarot, gaming and singing.

The bot should support public booking flows, performer operations, staff workflows, feedback, tickets, shop-related flows, server logs and moderation automation.

## Naming

- Server style: Japanese name first, English name second when appropriate.
- Preferred server name: ୨୧ 木ノ葉・KONOHA ୧
- Keep naming elegant and readable; decorative characters are acceptable.
- Code identifiers, file names and database fields should use clear English names.
- Do not put decorative Unicode into code identifiers.

## Core staff roles

- Owner: 火影・HOKAGE
- Admin: 暗部・ANBU
- Mod
- Support
- Male performer: 王子・PRINCE
- Female performer: 姫君・PRINCESS
- Cảnh vệ
- Custom
- Trap

Performers may need access to selected staff/operations channels.

## Customer rank roles

- Dân Làng
- Genin
- Chunin
- Jonin
- Sannin

Rank roles are status roles only. They must not grant moderation or administrative permissions.

Sannin is intended for weekly top customer ranking logic when that feature is implemented.

## Public priorities

Keep important customer flows easy to find:

- Booking
- Feedback
- Shop
- Ticket / Support
- Main chat near the top, but not necessarily the first channel

Ticket and report handling should be part of one ticket system rather than separate duplicate systems.

## Operations

The old mission/ryo concept is not the primary workflow.

Internal operations should support:

- order statistics
- generic orders that can be claimed by an available performer
- named-performer bookings
- performer availability
- shift check-in and check-out
- staff/booker/performer coordination

Members must not see internal staff-only operational channels.

## Logs

Logs should be a dedicated category and split by useful event type rather than one noisy catch-all channel.

At minimum consider:

- moderation logs
- member logs
- role logs
- channel/server configuration logs
- booking/order logs
- ticket logs
- error/runtime logs

Do not log secrets or sensitive credentials.

## Trap workflow

A trap channel may be visible and writable by everyone. A message in that channel can trigger the Trap role and moderation cleanup.

Implementation requirements:

- check bot permissions before acting
- avoid deleting unrelated users' messages
- keep an audit record of what action was taken
- make the handler idempotent to avoid repeated destructive loops
- Discord message cleanup must respect API limits and channel scope

## Bot game channels

The server may include channels for:

- Nối Từ VN
- Nối Từ EN
- Fishing
- Bot Commands
- Bóng Bánh

Treat third-party game integrations separately from core booking logic.

## Profile cards

The project may generate 16:9 profile cards for:

- staff: Admin, Mod, Support
- performers: PRINCE, PRINCESS
- customers: rank roles

Performer data can include active time, service tags, camera-opening price, badges and staff-join date.

Customer data can include total spent, weekly spent, remaining balance and join date.

## Change discipline

Before changing requirements:

1. Inspect current code and configuration.
2. Prefer existing repository behavior over stale assumptions.
3. If a requirement conflicts with code, identify the conflict clearly.
4. Do not silently rename roles, channels or workflows.
5. Keep changes backward-compatible where practical.
6. Update documentation/config examples when behavior changes.

## Completion criteria

A Konoha feature is not complete until:

- permissions are considered
- error paths are handled
- user-facing responses are understandable
- logs are useful
- configuration is documented
- startup does not depend on hard-coded machine-specific paths
