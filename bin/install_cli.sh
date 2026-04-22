#!/usr/bin/env bash
# Install CLI script to install the binaries.
# Supports macOS and Linux.
set -e

REPO='MichaelCurrin/auto-commit-msg'
REPO_URL="https://github.com/$REPO/releases/latest/download"

BINARIES=("acm" "gacm" "auto_commit_msg_generate")
INSTALL_DIR="$HOME/.local/bin"

OS_NAME=$(uname -s | tr '[:upper:]' '[:lower:]')
if [[ "$OS_NAME" == "darwin" ]]; then
  OS="macos"
elif [[ "$OS_NAME" == "linux" ]]; then
  OS="linux"
else
  echo "Error: Unsupported OS '$OS_NAME'"
  exit 1
fi

TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

echo "Install directory: '$INSTALL_DIR'."

for BIN in "${BINARIES[@]}"; do
  FILENAME="${BIN}-${OS}"

  DOWNLOAD_URL="${REPO_URL}/${FILENAME}"

  echo "Downloading '$FILENAME' as '$BIN'."
  if ! HTTP_STATUS=$(curl -LsS -o "${TEMP_DIR}/${BIN}" -w "%{http_code}" "$DOWNLOAD_URL"); then
    echo "Error: Failed to download '$BIN' from '$DOWNLOAD_URL'"
    exit 1
  fi

  if [[ "$HTTP_STATUS" != 200 ]]; then
    echo "Error: HTTP $HTTP_STATUS for '$DOWNLOAD_URL'"
    exit 1
  fi
done

install -d "${TEMP_DIR}/*" "$INSTALL_DIR"

echo 'Successfully installed.'
