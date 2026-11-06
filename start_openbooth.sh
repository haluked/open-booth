#!/usr/bin/env bash
# OpenBooth Launcher for Linux / macOS
set -e

echo "==================================================="
echo "            OPEN // BOOTH LAUNCHER"
echo "==================================================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "[1/2] Checking Python Virtual Environment..."
if [ -f "backend/venv/bin/python" ]; then
    PYTHON_EXE="backend/venv/bin/python"
elif [ -f "venv/bin/python" ]; then
    PYTHON_EXE="venv/bin/python"
else
    PYTHON_EXE="python3"
fi

echo "[2/2] Starting OpenBooth Server on http://localhost:8000..."
"$PYTHON_EXE" backend/main.py
