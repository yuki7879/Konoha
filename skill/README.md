# Konoha Antigravity Skills

This folder is a human-readable index for the project's Antigravity skills.

Antigravity 2.0 discovers workspace skills from:

.agents/skills/<skill-name>/SKILL.md

The executable skill definitions for this repository therefore live under .agents/skills/.

## Included skills

- konoha-project-context — project domain, current requirements, naming and role conventions.
- discord-bot-engineering — implementation rules for Discord bot features.
- runtime-debugging — startup, offline, dependency, config and event debugging.
- code-review — correctness and regression review before changes are considered complete.
- git-workflow — repository hygiene, commits and safe change workflow.
- config-and-security — secrets, environment variables, permissions and configuration safety.

## Working rule

Before making a non-trivial change, Antigravity should inspect the repository first, activate the relevant skills, make the smallest coherent change, validate it, and summarize what changed and how it was verified.

Do not treat this README as a skill manifest. The SKILL.md files under .agents/skills/ are the actual Antigravity skills.
