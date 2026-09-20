---
name: discord-bot-engineering
description: Guides implementation and refactoring of the Konoha Discord bot, including commands, events, buttons, modals, roles, channels, permissions, booking flows and Discord API behavior. Use for any Discord bot coding task in this repository.
---

# Discord Bot Engineering

Build the bot as maintainable production code rather than a single large script.

## First inspection

Before editing:

1. Read package.json and the configured start script.
2. Identify the actual entry point.
3. Inspect src/lib/config folders before creating duplicates.
4. Determine the installed discord.js major version from package.json.
5. Follow the APIs for the installed version instead of guessing.
6. Search for existing handlers before adding new ones.

If the project has not been bootstrapped yet, create the smallest clean structure needed for the requested feature.

## Recommended architecture

Prefer separation by responsibility:

- entry point: client startup only
- config: configuration loading and validation
- commands: slash/chat-input commands
- interactions: buttons, select menus and modals
- events: Discord gateway events
- services: booking, ticket, shift, feedback and ranking business logic
- repositories/data: persistent data access
- utils: small reusable helpers
- logs: structured logger helpers

Avoid one huge index.js containing every feature.

## Discord client

- Request only intents actually required.
- Document privileged intents that must also be enabled in the Discord Developer Portal.
- Register event handlers once.
- Prevent duplicate listeners during reloads.
- Handle ready, warning, error, shard or websocket failures where relevant.

## Interactions

Every interaction handler must:

- validate expected custom IDs and payloads
- verify member/role authorization
- acknowledge the interaction within Discord timing limits
- use deferReply/deferUpdate when work may take longer
- catch errors and provide a safe user-facing failure message
- avoid leaking stack traces or secrets

For destructive or administrative actions, require explicit authorization checks in code even if channel permissions are configured.

## Roles and channels

When creating or syncing server resources:

- make operations idempotent
- resolve by stored ID when possible
- fall back to exact intended name only when necessary
- never create duplicates on every restart
- verify role hierarchy before assigning/removing roles
- verify Manage Roles / Manage Channels / Manage Messages permissions before use

Do not grant rank roles administrative permissions.

## Booking workflow

Model booking as an explicit state machine.

Example states may include:

- pending
- waiting_for_performer
- claimed
- confirmed
- in_progress
- completed
- cancelled

Use repository terminology if states already exist.

Rules:

- one order has one canonical ID
- state transitions must be validated
- prevent two performers claiming the same order
- persist the actor and timestamp for important transitions
- log state changes
- keep UI messages synchronized with persistent state

## Shift and availability

- distinguish shift status from order status
- prevent duplicate check-in/check-out transitions
- persist timestamps
- do not assume a performer is available merely because they are online
- expose availability through a service instead of duplicating logic across commands

## Tickets

Use one ticket system for Booking, Apply and Support when that matches current product flow.

- prevent duplicate open tickets when policy requires one active ticket
- restrict ticket visibility
- log ticket creation/closure
- sanitize channel names
- handle deleted channels gracefully

## Data and concurrency

For any shared mutable state:

- prefer persistent storage over in-memory-only maps for important business state
- enforce uniqueness where race conditions are possible
- use transactions/atomic operations where the chosen database supports them
- never rely solely on message text as the database

## Error handling

Never swallow errors silently.

For expected errors:
- return a concise user-facing message

For unexpected errors:
- log error name, message, stack and relevant non-secret context
- include operation/order IDs when available

## Validation

After changes:

1. run dependency installation only when needed
2. run available lint/typecheck/test scripts
3. run syntax/startup checks
4. inspect console output for unhandled rejections
5. verify the changed interaction path
6. state what was actually tested and what was not

Do not claim a feature works unless it was verified or the limitation is stated.
