#!/bin/sh
# Set up the sandbox directly.
set -e

if [ -d sandbox ]; then
  rm -rf sandbox
fi

git init sandbox --quiet
cd sandbox

# Create a commit, so that the extension can run diff-index, which requires an initial commit.
echo "# Sandbox\n" >'README.md'
git add -A
git commit -m 'Initial commit in sandbox'
