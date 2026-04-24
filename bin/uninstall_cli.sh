#!/usr/bin/env bash
# Uninstall auto-commit-msg CLI binaries.
set -e

BINARIES=("acm" "gacm" "auto_commit_msg_generate")
INSTALL_DIR="$HOME/.local/bin"

rm -f "${BINARIES[@]/#/$INSTALL_DIR/}"

echo "auto-commit-msg binaries uninstalled successfully"
