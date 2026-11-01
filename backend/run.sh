#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"
source ./.venv/bin/activate
uvicorn main:app --reload --host 127.0.0.1 --port 8000
