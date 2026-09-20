---
name: config-and-security
description: Handles Konoha configuration, Discord IDs, environment variables, bot permissions and secret management safely. Use when adding tokens, credentials, config files, deployment settings, role/channel IDs or permission-sensitive behavior.
---

# Configuration and Security

Treat configuration as code and secrets as secrets.

## Secrets

Discord bot tokens and private credentials must come from environment variables or a deployment secret store.

Never:

- hard-code a live token in source code
- commit a .env file containing secrets
- print tokens to console
- expose secrets in embeds or error messages
- store secrets in config.json

If a token has been exposed, recommend rotating it.

## Configuration layers

Prefer this split:

Environment/secrets:
- DISCORD_TOKEN
- database credentials
- external API secrets

Non-secret config:
- guild ID
- application/client ID
- channel IDs
- role IDs
- feature flags
- locale/theme settings

Provide a safe example file such as .env.example when appropriate, containing names only and placeholder values.

## Startup validation

Validate required settings before login.

A missing required setting should produce an actionable error such as:

Missing required environment variable: DISCORD_TOKEN

Do not include the secret value in the error.

## Discord IDs

IDs should be configurable instead of scattered as magic constants.

When a config.json is used:

- keep keys grouped by domain
- use stable descriptive names
- validate snowflake-like values before use
- handle deleted/stale Discord resources gracefully

## Permissions

Use least privilege.

Before performing privileged operations, check:

- bot guild permissions
- channel-specific permission overwrites
- bot role position
- target role position
- invoking member authorization

Do not rely only on a hidden channel to secure an administrative action.

## Logging

Logs may include:

- actor ID
- target ID
- guild/channel ID
- action
- result
- timestamp
- correlation/order/ticket ID

Logs must not include tokens, passwords or private credentials.

## Configuration changes

When adding a required config value:

1. update validation
2. update example/documentation
3. update deployment instructions if needed
4. ensure old installations fail with a clear message rather than obscure runtime errors
