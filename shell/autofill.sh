#!/usr/bin/env bash
# Autofill script.
#
# Produce a commit message from changed files and print to stdout.
# This works similar to a git hook but is intended to be used alone or in a git alias.
#
# See shell/README.md doc.

CHANGES=$(git diff-index --name-status HEAD)
MESSAGE=$(node out/cli.js "$CHANGES")
echo $MESSAGE
