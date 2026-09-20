---
name: code-review
description: Reviews Konoha code changes for correctness, regressions, Discord API misuse, permission bugs, race conditions, data loss and maintainability. Use before completing a substantial implementation, refactor or bug fix.
---

# Code Review

Review changed code against the requested behavior and surrounding repository conventions.

## Priority order

Report issues in this order:

1. data loss or destructive behavior
2. security/secrets exposure
3. permission/authorization bugs
4. incorrect business logic
5. race conditions and duplicate processing
6. runtime crashes and unhandled promises
7. Discord API misuse
8. regressions
9. maintainability problems
10. style/naming issues

## Review questions

### Correctness

- Does the implementation satisfy the requested user flow?
- Are all state transitions valid?
- Are IDs and persisted records handled consistently?
- Are edge cases covered?

### Discord behavior

- Are interactions acknowledged in time?
- Are intents appropriate?
- Are member/channel/role fetches robust?
- Are hierarchy and permissions checked?
- Could a restart create duplicate channels, roles, commands or listeners?

### Authorization

- Are staff-only actions checked in application logic?
- Can a member forge a button custom ID to trigger staff behavior?
- Are rank roles correctly prevented from receiving privileged permissions?

### Concurrency

- Can two users claim the same booking?
- Can the same button be processed twice?
- Can duplicate events create duplicate records?
- Are database constraints or atomic operations needed?

### Reliability

- Are async operations awaited?
- Are failures logged?
- Does startup fail clearly on missing required config?
- Does one malformed record crash the entire bot?

### Maintainability

- Is business logic separated from Discord rendering?
- Is the same permission/state logic duplicated?
- Are names precise?
- Are modules small enough to reason about?

## Output

When reviewing, provide:

- finding severity
- exact file and relevant function/section
- why it is a problem
- concrete correction

Do not invent problems without evidence from the code.

If no blocking issue is found, state remaining unverified risks such as missing integration tests.
