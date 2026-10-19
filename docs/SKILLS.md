# Project-local skills

All nine approved skills are vendored under `.agents/skills/`, including their bundled references and scripts. Nothing is installed globally. Start a new turn in this project to refresh skill discovery.

| Skill | Purpose | Upstream |
| --- | --- | --- |
| svelte-code-writer | Svelte documentation and autofixer | [Svelte](https://github.com/sveltejs/ai-tools/tree/main/tools/skills/svelte-code-writer) |
| svelte-core-bestpractices | Modern Svelte 5 patterns | [Svelte](https://github.com/sveltejs/ai-tools/tree/main/tools/skills/svelte-core-bestpractices) |
| impeccable | Design direction, critique, and refinement | [Impeccable](https://github.com/pbakaus/impeccable/tree/main/.agents/skills/impeccable) |
| frontend-design | Frontend visual implementation | [Anthropic](https://github.com/anthropics/skills/tree/main/skills/frontend-design) |
| frontend-ui-engineering | Component and frontend architecture | [Addy engineering](https://github.com/addyosmani/agent-skills/tree/main/skills/frontend-ui-engineering) |
| spec-driven-development | Specification before approved feature work | [Addy engineering](https://github.com/addyosmani/agent-skills/tree/main/skills/spec-driven-development) |
| code-review-and-quality | Evidence-based code review | [Addy engineering](https://github.com/addyosmani/agent-skills/tree/main/skills/code-review-and-quality) |
| performance | Measurement and runtime performance | [Addy web quality](https://github.com/addyosmani/web-quality-skills/tree/main/skills/performance) |
| accessibility | Keyboard access, semantics, and accessibility checks | [Addy web quality](https://github.com/addyosmani/web-quality-skills/tree/main/skills/accessibility) |

## Dependencies and provenance

[Source manifest](skill-sources.json) records upstream revisions and paths. Licenses are in `vendor-licenses/` and the Anthropic skill's own `LICENSE.txt`. The root application has no new license assigned by this setup.

Addy engineering's three shared checklists are vendored in `.agents/references/` to preserve its `../../references/` links. The web quality skills include their own `references/` directories. Their links to optional sibling audit skills remain upstream workflow suggestions; those additional skills are not installed.

Impeccable includes its launcher and reference files. Its launcher may download a platform runtime on first use. No automated hooks were installed. Svelte code writer invokes `@sveltejs/mcp` through `npx`, which can require network access.

Use one agreed visual direction across Impeccable and frontend-design. These skills guide implementation against the confirmed scope in `PRODUCT.md` and the proposed plan in `../tasks/plan.md`. The grilling interview is complete; use it again only for a material scope change.

## Updating

Update explicitly from the listed upstream repository and retain the complete skill directory, license, and any shared references. Refresh the manifest and review the diff. Keep project-local copies as real tracked files, not links to a developer's home directory.
