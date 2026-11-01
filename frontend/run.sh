#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

if command -v brew >/dev/null 2>&1 && brew list --formula node@24 >/dev/null 2>&1; then
  export PATH="$(brew --prefix node@24)/bin:/opt/homebrew/bin:$PATH"
fi

if [ "${1:-}" = "v2" ] || [ "${1:-}" = "dev2" ]; then
  npm run dev2
else
  npm run dev
fi

