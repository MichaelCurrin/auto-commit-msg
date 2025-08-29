#!/usr/bin/env bash
# Autofill script.
#
# Produce a commit message from changed files and print to stdout.
#
# The preferred way is to use a TS command in `src/bin` instead, to avoid
# having to put this .sh script in a bin directory when npm link works.
 # But this was the original way.`
set -e

DIFF_FLAGS='--name-status --find-renames --find-copies --no-color'
CHANGES=$(git diff-index $DIFF_FLAGS HEAD)

MESSAGE=$(auto_commit_msg_generate "$CHANGES")
echo "$MESSAGE"
