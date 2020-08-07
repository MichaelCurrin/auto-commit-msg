#!/bin/sh
# A minimal git commit hook.

COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2
SHA1=$3

CHANGES=$(git status -s -uno --porcelain)

echo 'Input values'
echo "COMMIT_MSG_FILE = $COMMIT_MSG_FILE"
echo "COMMIT_SOURCE = $COMMIT_SOURCE"
echo "SHA1 = $SHA1"

echo -n "This is a message inserted before your commit message\n$CHANGES" >$COMMIT_MSG_FILE
