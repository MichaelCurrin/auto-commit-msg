#!/usr/bin/env bash
# CLI test for autofill hook.
#
# This script is *not* ready to be used in other projects. See shell/README.md
# for dev notes.
#
# This is a pure CLI script that bypasses using VS Code or an extension.
# It will get output from Git, send it to Node CLI entry-point tool and print
# it. This can be used as part of Git commit message hook flow (pre-commit hook).
#
# Optionally add a `-d` debug flag to print without writing to a file. This
# makes it easy to debug the script outside a Git commit hook flow.
#  ./autofill-hook.sh -p
#
# See shell/README.md doc.
set -e

if ! command -v acm &> /dev/null; then
  echo "Error: `acm` could not be found"
  exit 1
fi

COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2

echo 'Input values'
echo "COMMIT_MSG_FILE = $COMMIT_MSG_FILE"
# Either 'message' or 'template'
echo "COMMIT_SOURCE = $COMMIT_SOURCE"

# TODO: Test this - this conditional is untested.
if [ "$COMMIT_SOURCE" = 'template']; then
  echo "Current commit message"
  <"$COMMIT_MSG_FILE"
fi

CHANGES=$(git diff-index --name-status HEAD)
MESSAGE=$(acm "$CHANGES")

if [ "$1" = '-p' ]; then
  echo "$MESSAGE"
else
  echo "$MESSAGE" >$COMMIT_MSG_FILE
fi
