#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
preview_revision=$(git rev-parse HEAD)
preview_path='keyboard-artist-preview'
preview_base='/virtual-keyboard/keyboard-artist-preview/'
npm run build -- --base="$preview_base"
node -e 'const fs=require("node:fs");fs.writeFileSync("dist/build.json",JSON.stringify({revision:process.argv[1]},null,2)+"\n")' "$preview_revision"
git fetch origin gh-pages
preview_checkout=$(mktemp -d /tmp/keyboard-artist-pages.XXXXXX)
rmdir "$preview_checkout"
git worktree add --detach "$preview_checkout" origin/gh-pages
cleanup() { git worktree remove --force "$preview_checkout"; }
trap cleanup EXIT
mkdir -p "$preview_checkout/$preview_path"
rsync -ac --delete dist/ "$preview_checkout/$preview_path/"
git -C "$preview_checkout" add -- "$preview_path"
if git -C "$preview_checkout" diff --cached --name-only | rg -v '^keyboard-artist-preview/'; then
  echo 'Refusing to publish changes outside the preview directory.' >&2
  exit 1
fi
git -C "$preview_checkout" commit -m "deploy: publish Keyboard Artist review preview ${preview_revision:0:7}"
git -C "$preview_checkout" push origin HEAD:gh-pages
