#!/usr/bin/env bash
# Proof of concept script to use Bash to produce report of file counts from git status.
#
# Run this as a standalone report, not as a hook. If you use this as a hook, it will
# print output in the console only not add to commit message
#
# See simple-hook.sh script for how CHANGES
# would get written out to a commit message file.
#
# This script will get count of files added, modified, deleted and renamed/moved and output it.
# Note that modified and renamed/moved can both apply to the same file.
# There also other states like C for copied and ?? for untracked.

# This report uses git status and passes it do the steps below to parse it.
# A more flexible approach (for unit tests for example) would be for this
# script to handle the status and call another script to do the parsing and result. Then
# the script could be used separate from git and so accept a filename or stdin.

# Status summary excluding untracked files using a flag.
CHANGES=$(git status -s -uno --porcelain)

# Note quotes AND -n to preserve newlines so line count for grep, for start of lines works.
FILES=$(echo -n "$CHANGES" | wc -l)

echo "All files changed: $FILES"

ADD=$(echo -n "$CHANGES" | grep -c '^A')
if [[ "$ADD" -ne 0 ]]; then
  echo "Added: $ADD"
fi

MOD=$(echo -n "$CHANGES" | grep -c '^.M')
if [[ "$MOD" -ne 0 ]]; then
  echo "Modified: $MOD"
fi

DEL=$(echo -n "$CHANGES" | grep -c '^.D')
if [[ "$DEL" -ne 0 ]]; then
  echo "Deleted: $DEL"
fi

REN=$(echo -n "$CHANGES" | grep -c '^R')
if [[ "$REN" -ne 0 ]]; then
  echo "Renamed or moved: $REN"
fi

echo
echo 'Original status:'
echo
echo "$CHANGES"
