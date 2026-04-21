#!/usr/bin/env bash
# Install CLI script to install the binaries.
# Supports macOS and Linux.
set -e

REPO='MichaelCurrin/auto-commit-msg'
BINARIES=("acm" "gacm" "auto_commit_msg_generate")
INSTALL_DIR="$HOME/.local/bin"

OS_NAME=$(uname -s | tr '[:upper:]' '[:lower:]')
if [[ "$OS_NAME" == "darwin" ]]; then
  OS="macos"
elif [[ "$OS_NAME" == "linux" ]]; then
  OS="linux"
else
  echo "Error: Unsupported OS ($OS_NAME)"
  exit 1
fi

TAG=$(
  curl -s https://api.github.com/repos/$REPO/releases |
    grep '"tag_name":' | head -n 1 | cut -d '"' -f 4
)
echo "Found latest tag: '$TAG'."
REPO_URL="https://github.com/$REPO/releases/download/$TAG"

TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT
mkdir -p "$INSTALL_DIR"

for BIN in "${BINARIES[@]}"; do
  FILENAME="${BIN}-${OS}"
  DEST_PATH="${INSTALL_DIR}/${BIN}"

  echo "Installing $BIN for $OS."
  DOWNLOAD_URL="${REPO_URL}/${FILENAME}"

  if ! HTTP_STATUS=$(curl -LsS -o "${TEMP_DIR}/${BIN}" -w "%{http_code}" "$DOWNLOAD_URL"); then
    echo "Error: Failed to download '$BIN' from '$DOWNLOAD_URL'"
    exit 1
  fi

  if [[ ! "$HTTP_STATUS" =~ ^2 ]]; then
    echo "Error: Download failed for '$BIN' from '$DOWNLOAD_URL' (HTTP $HTTP_STATUS)"
    exit 1
  fi

  install "${TEMP_DIR}/${BIN}" "$DEST_PATH"
done

echo "Successfully installed '${BINARIES[*]}' to '$INSTALL_DIR'"
