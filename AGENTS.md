# Project instructions

Read README.md and docs/PRODUCT.md before changing product behavior. The user confirmed the v1 scope on 2026-10-20; discovery is complete. The proposed implementation plan is in tasks/plan.md and delivery tasks are in tasks/todo.md. Do not reopen settled scope questions. Follow the reviewed plan when implementation is requested, and bring evidence before proposing a scope change.

## Skills

Use project-local skills in `.agents/skills/`; see docs/SKILLS.md for routing, provenance, and dependencies. Read only the relevant skill and references for the task.

- Svelte files: load `svelte-code-writer` and `svelte-core-bestpractices`; run the Svelte autofixer before finalizing components.
- Interface work: use `impeccable` for design direction and critique; use `frontend-design` when useful for implementation. Reconcile direction with the approved product decisions before editing UI.
- Component architecture: `frontend-ui-engineering`.
- Approved implementation planning: `spec-driven-development`.
- Review: `code-review-and-quality`.
- Performance and accessibility: the corresponding skills; measure before claiming improvements.

## Working conventions

Preserve unrelated changes and legacy branches. Use Svelte 5 runes for new reactive code and TypeScript for new application logic. Keep implementation proportional to the confirmed scope. Do not add a `[codex]` template or prefix. Explain decisions in plain language and support technical claims with evidence.

Run `npm run check` and `npm run build` after application or configuration changes. Add behavior tests when product functionality exists; do not present a green starter build as feature coverage.
