<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Model Routing Policy: Gemini 4 Hydrogen

(Owner, 2026-11-16: Gemini 4 Hydrogen is cheaper than Opus but gets worse the longer a task runs, or over long cycles of sims or loops. This section is only how to use it. Applies to every agent on evo-x2 and nucbox-m8.)

### Use it for: single-run, stateless jobs
- Use Gemini 4 Hydrogen (`thinking: high`) only as a single-run worker on a bounded, self-contained task that finishes in 1–3 turns with a fresh context.
- Good fits: single-file code generation or refactors, targeted bug fixes with an exact stack trace, one-shot codebase questions, structured data/JSON extraction, unit test generation, and PDF, image or video reading.
- Pass only the files, schema and acceptance criteria the task needs. Take back the output or diff, then end that context.

### Do not use it for
- Long-running stateful sessions, debugging loops that go past 3 failed attempts, multi-step simulations, or open-ended architecture planning.

### When it fails
1. After 2–3 failed turns, stop that thread. Start a fresh Hydrogen run with narrower inputs, or hand the task back to the Claude orchestrator.
2. Global state, multi-turn loops and simulations, and cross-file architecture decisions stay with Claude; Hydrogen only gets single stateless steps.
