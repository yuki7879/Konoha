---
name: git-workflow
description: Defines safe Git and GitHub workflow for Konoha, including repository inspection, focused commits, avoiding accidental file loss and keeping changes reviewable. Use when creating, editing, deleting, committing or preparing repository changes.
---

# Git Workflow

Keep repository changes small, traceable and reversible.

## Before changes

- inspect current branch and working tree
- inspect recent relevant commits when behavior is unclear
- read the files that will be edited
- do not overwrite newer work blindly
- identify generated files and ignored files

## Change scope

One task should produce one coherent change set.

Avoid:

- unrelated formatting across the repository
- mass renames without need
- deleting unfamiliar files just to simplify the tree
- replacing existing architecture before understanding it

## Commits

Use concise conventional-style messages when practical:

- feat: new behavior
- fix: bug fix
- refactor: internal restructuring
- docs: documentation only
- test: tests only
- chore: maintenance/configuration

A commit message should describe the result, not the editing process.

## Secrets

Never commit:

- Discord bot tokens
- private API keys
- passwords
- session cookies
- private certificates
- production environment files

If a secret is discovered in tracked history, do not merely add it to .gitignore. Flag it for rotation and history cleanup.

## File deletion

Before deleting a file:

1. search references
2. identify replacement or confirm obsolescence
3. assess startup/build impact
4. delete only as part of a clear change

## Generated artifacts

Do not commit node_modules, local logs, build outputs or editor state unless repository policy explicitly requires them.

## Completion

Before reporting completion:

- review the final diff
- ensure only intended files changed
- run available checks
- mention any files intentionally not modified
