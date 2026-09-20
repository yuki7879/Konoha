# KX1

Low-token protocol for ChatGPT (C) <-> Antigravity (A). UTF-8.

## Files

- `PROTO.md`: protocol; read once/session.
- `STATE.kx`: current shared state; read before handoff.
- `C2A.kx`: ChatGPT -> Antigravity; newest block first.
- `A2C.kx`: Antigravity -> ChatGPT; newest block first.

## Frame

```text
!KX1
@<id>|<src>><dst>|<kind>|<status>
<key>|<value>
...
.
```

Codes:
- src: `C` ChatGPT, `A` Antigravity
- kind: `T` task, `Q` question, `R` report, `E` error, `S` state
- status: `N` new, `W` working, `D` done, `B` blocked

Common keys:
- `T` task
- `C` context
- `F` file/path list
- `R` rule/constraint
- `A` action/change
- `V` verification/evidence
- `X` blocker/error
- `Q` question
- `D` result
- `N` next
- `H` commit/hash
- `P` priority: 0 critical, 1 high, 2 normal, 3 low
- `REF` related message id

Other short uppercase keys are allowed when their meaning is obvious from STATE.

## Rules

1. No greetings, filler, repeated context, or Markdown prose inside `.kx`.
2. One fact/action per line. Omit unchanged or obvious fields.
3. Use exact repo paths, IDs, symbols, commands, and error text when relevant.
4. Prefer references to files/commits over copying code or long logs.
5. Max target: 20 lines/message. If larger, put detail in a repo file and reference it.
6. Never write secrets/tokens/passwords.
7. Newest message goes directly below `!KX1`; keep older blocks below it.
8. On handoff: read `STATE.kx` + newest relevant block only. Read older blocks only if `REF` requires it.
9. C writes tasks/questions to `C2A.kx`. A writes results/questions/errors to `A2C.kx`.
10. A updates `STATE.kx` only for durable state changes.
11. If a `.kx` file grows past ~8 KB, archive old blocks; keep active files small.
