#!/bin/sh
# A minimal git commit hook.
# Usage:
#   ./simple-hook.sh MSG SRC SHA [-d]
# The last part is an optional non-standard flag, allowing this to be run directly without writing out.

set -e

# These are the 3 standard prepare-commit-msg args as per the hooks example and git hook docs.
COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2
SHA1=$3

CHANGES=$(git status -s -uno --porcelain)

echo 'Input values'
echo "COMMIT_MSG_FILE = $COMMIT_MSG_FILE"
echo "COMMIT_SOURCE = $COMMIT_SOURCE"
echo "SHA1 = $SHA1"

MESSAGE="This is a message inserted before your commit message
$CHANGES"

if [ "$4" = '-d' ]; then
    echo '\nDRY RUN'
    echo "$MESSAGE"
else
    # Note that -n flag is not needed here on echo.
    echo "$MESSAGE" >$COMMIT_MSG_FILE
fi

# There is a weird bug where the space before the first line goes missing, but not in the dry run output.
#
# This is a message inserted before your commit message
# M  docs/installation.md
#  M shell/count-files.sh
#  M shell/simple-hook.sh

# Even weird in the logs
#    This is a message inserted before your commit message
#     M docs/installation.md
#     M shell/count-files.sh
#    M  shell/simple-hook.sh
