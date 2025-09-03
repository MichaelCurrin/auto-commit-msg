#!/bin/sh

# This script is based on the prepare-commit-msg.sample file that comes by
# default in any git repo when you run git init or git clone (you can also run
# git init later on to restore hooks).
# Note everything here is uncommented but you're only meant to run one of the 3
# sections after setting up vars.

# e.g. '.git/COMMIT_EDITMSG'
COMMIT_MSG_FILE=$1
# e.g. 'message' or 'template'
COMMIT_SOURCE=$2
# A hash, if relevant.
SHA1=$3

###

# Remove line.
/usr/bin/perl -i.bak \
  -ne 'print unless(m/^. Please enter the commit message/..m/^#$/)' \
  "$COMMIT_MSG_FILE"

###

# Show files changed.
# (It will uncomment files changed in the message, which is maybe less
# efficient than just running git status but this is what git comes with.)
case "$COMMIT_SOURCE,$SHA1" in
, | template,)
  /usr/bin/perl -i.bak -pe '
      print "\n" . `git diff --cached --name-status -r`
	 if /^#/ && $first++ == 0' "$COMMIT_MSG_FILE"
  ;;
*) ;;
esac
