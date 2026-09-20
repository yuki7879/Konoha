---
name: runtime-debugging
description: Diagnoses Konoha bot startup failures, offline status, crashes, missing dependencies, bad environment configuration, Discord login issues and runtime errors. Use when the bot does not start, stays offline, exits unexpectedly or logs an error.
---

# Runtime Debugging

Debug from evidence, not guesses.

## Triage order

1. Reproduce the failure with the repository's documented start command.
2. Capture the first meaningful error, not only the final exit code.
3. Inspect package.json scripts and entry point.
4. Confirm the expected Node.js version.
5. Confirm dependencies are installed.
6. Validate environment/config inputs without printing secrets.
7. Check Discord login and privileged intents.
8. Inspect application logs and recent code changes.

## Startup checklist

Verify:

- package.json exists
- start script points to a real file
- module type matches import/require usage
- required packages are declared
- lockfile is consistent with package manager
- config loader runs before features consume config
- required directories/files exist
- database/storage initialization succeeds
- Discord client login is actually called
- process is not exiting immediately after login

## Offline bot diagnosis

If the process is running but Discord shows the bot offline, check:

- token variable is present
- token belongs to the intended bot application
- login promise rejects or resolves
- outbound network/DNS is available
- Discord gateway errors
- client ready event fires
- privileged intents match both code and Developer Portal settings

Never print or paste the token into logs.

## Dependency problems

When modules are missing:

- compare imports with package.json
- use the repository's package manager
- do not install random packages merely because names look similar
- prefer a clean install when lockfile/node_modules mismatch is plausible
- report dependency version conflicts explicitly

## Config problems

Validate required configuration at startup and fail fast with names of missing variables, never their secret values.

Separate:

- secrets
- Discord resource IDs
- feature flags
- database settings
- environment-specific settings

## Runtime errors

For crashes after startup:

- identify the exact event/command/interaction
- trace the stack to project code
- inspect null/undefined assumptions
- check Discord partials/caches and fetched objects
- check role/channel hierarchy and permissions
- check stale IDs
- check asynchronous code for missing await and rejected promises

## Fix strategy

Prefer the smallest root-cause fix.

Do not hide symptoms by:

- wrapping everything in empty try/catch
- disabling validation
- ignoring rejected promises
- adding arbitrary delays
- repeatedly restarting without diagnosis

## Verification

After a fix:

1. rerun the exact failing command
2. confirm client ready status
3. exercise the affected feature
4. ensure no new unhandled rejection appears
5. summarize root cause, change and verification evidence
