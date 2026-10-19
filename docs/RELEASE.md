# Isolated review preview

Publication is in progress. Target: https://proggarapsody.github.io/virtual-keyboard/keyboard-artist-preview/.

## Hosting inspection

GitHub Pages API reports legacy branch deployment from `gh-pages:/`, no custom domain, and no Actions workflows. The original public site is https://proggarapsody.github.io/virtual-keyboard/. Its root HTML SHA-256 before preview publication is `401a8b644031ac85395b6b2bfdbf18986b76ee6c36339af07ab16f5389c440c0`.

The preview adds only `keyboard-artist-preview/` to the existing Pages tree. It does not replace root HTML/assets, change the Pages source, rewrite legacy history, or merge the implementation into main. The implementation remains on `feature/keyboard-artist-v1`.

## Publish

`scripts/publish-preview.sh` builds with the explicit nested base path, creates an isolated temporary checkout from the current remote Pages head, copies only `dist/` into the preview directory, verifies every changed path starts with that directory, commits, and pushes a fast-forward update. `build.json` in the preview records the exact application revision. Concurrent Pages changes cause normal push rejection rather than a forced overwrite.

## Promote and roll back

Production promotion is a separate future change requiring the user's explicit approval after the acceptance gaps in VALIDATION.md are resolved. No promotion action is included in the preview script.

Preview rollback: revert the single scoped deployment commit on `gh-pages`, or remove only `keyboard-artist-preview/` in a new commit. Leave root files and legacy branch history intact. Before any production replacement, archive the exact original Pages revision and verify restoration from that revision; no production rollback is needed for this isolated preview because root files are unchanged.
