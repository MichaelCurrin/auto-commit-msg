#!/usr/bin/env bash
# CLI test for autofill hook.
#
# See shell/README.md doc.
set -e

GENERATE_CMD='auto_commit_msg_generate'

if ! command -v "$GENERATE_CMD" &> /dev/null; then
  echo "Error: $GENERATE_CMD could not be found"
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
MESSAGE=$($GENERATE_CMD "$CHANGES")

if [ "$1" = '-p' ]; then
  echo "$MESSAGE"
else
  echo "$MESSAGE" >$COMMIT_MSG_FILE
fi
