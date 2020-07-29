#!/usr/bin/env bash
# Proof of concept script to use Bash to produce report of file counts from git status.

# Run this as a standalone report, not as a hook.
#
# Get count of files added, modified, deleted and renamed/moved.
# Note that modified and renamed/moved can both apply to the same file.

# This report uses git status and passes it do the steps below to parse it.
# A more flexible approach (for unit tests for example) would be for this
# script to handle the status and call another script to do the parsing and result. Then
# the script could be used separate from git and so accept a filename or stdin.
CHG=$(git status -s -uno --porcelain)

# Note quotes and -n to preserve newlines so line count or grep for start of lines works.
FILES=$(echo -n "$CHG" | wc -l)

echo "All files changed: $FILES"

ADD=$(echo -n "$CHG" | grep -c '^A')
if [[ "$ADD" -ne 0 ]]; then
  echo "Added: $ADD"
fi

MOD=$(echo -n "$CHG" | grep -c '^.M')
if [[ "$MOD" -ne 0 ]]; then
  echo "Modified: $MOD"
fi

DEL=$(echo -n "$CHG" | grep -c '^.D')
if [[ "$DEL" -ne 0 ]]; then
  echo "Deleted: $DEL"
fi

REN=$(echo -n "$CHG" | grep -c '^R')
if [[ "$REN" -ne 0 ]]; then
  echo "Renamed or moved: $REN"
fi

echo
echo 'Original:'
echo
echo "$CHG"
