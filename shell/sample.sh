#!/bin/sh

# This script is based on the prepare-commit-msg.sample file in a git repo.

COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2
SHA1=$3

# Remove line.
/usr/bin/perl -i.bak -ne 'print unless(m/^. Please enter the commit message/..m/^#$/)' "$COMMIT_MSG_FILE"

LINES=$(git status -s -uno --porcelain | wc -l)
# Write over
# echo "Files changed: $LINES" > $COMMIT_MSG_FILE

# Show files change.
# (Uncomments files changed in the message)
#
# case "$COMMIT_SOURCE,$SHA1" in
#  ,|template,)
#    /usr/bin/perl -i.bak -pe '
#       print "\n" . `git diff --cached --name-status -r`
# 	 if /^#/ && $first++ == 0' "$COMMIT_MSG_FILE" ;;
#  *) ;;
# esac
