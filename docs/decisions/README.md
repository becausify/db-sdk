# Decisions

Architecture Decision Records (ADRs) for this repository. They are the place to look up **why** something is the way it is — for people and for AI agents.

| ID | Decision |
| --- | --- |
| [0001](0001-developer-docs.md) | Developer docs: Fumadocs, TSDoc, live type tables |
| [0002](0002-query-only.md) | Query-only — never implement writes |
| [0003](0003-providers-and-drivers.md) | Providers and drivers (N providers → 1 driver) |
| [0004](0004-docs-for-providers.md) | Docs for every new driver / hosted provider (AutoTypeTable) |

## How to add one

1. Copy the next number (`0002`, `0003`, …).
2. Write the context, the decision, and what we are explicitly not doing.
3. Link it from this table.
4. If agents should follow it, mention it in `AGENTS.md` and `.cursor/rules/`.

Do not re-litigate a settled ADR unless someone asks to change the decision. Update the ADR when the decision actually changes.
