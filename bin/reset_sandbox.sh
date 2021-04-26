#!/bin/sh
# Set up the sandbox directory.
set -e

DIR='sandbox'

if [ -d "$DIR" ]; then
  rm -rf "$DIR"
fi

git init "$DIR" --quiet
cd "$DIR"

# Create a commit, so that the extension can run diff-index, which requires an initial commit.
echo "# Sandbox\n" >'README.md'
git add -A
git commit -m "Initial commit in $DIR"
