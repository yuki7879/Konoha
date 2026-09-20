# Konoha Antigravity Skills

This folder is a human-readable index for the project's Antigravity skills.

Antigravity 2.0 discovers workspace skills from:

.agents/skills/<skill-name>/SKILL.md

The executable skill definitions for this repository therefore live under .agents/skills/.

## Included skills

### Project & engineering

- konoha-project-context — project domain, requirements, naming and role conventions.
- discord-bot-engineering — implementation rules for Discord bot features.
- runtime-debugging — startup, offline, dependency, config and event debugging.
- code-review — correctness and regression review before changes are considered complete.
- git-workflow — repository hygiene, commits and safe change workflow.
- config-and-security — secrets, environment variables, permissions and configuration safety.

### Visual & content quality

- visual-design-eye — visual hierarchy, balance, spacing, typography and overall polish.
- pixel-perfect-ui — measured dimensions, alignment, spacing and reference matching.
- visual-qa — screenshot-based visual verification and iteration.
- human-copywriting-vi — natural Vietnamese UI/Discord copy without stiff AI phrasing.
- discord-ui-design — polished Discord embeds, buttons, selects, modals, tickets and booking UI.
- design-system — reusable visual tokens, components and consistency rules.

## Working rule

Before making a non-trivial change, Antigravity should inspect the repository first, activate the relevant skills, make the smallest coherent change, validate it, and summarize what changed and how it was verified.

For visual work, do not stop after code compiles. Render the actual result, inspect it, measure where necessary, fix visible problems, and verify again.

Do not treat this README as a skill manifest. The SKILL.md files under .agents/skills/ are the actual Antigravity skills.
