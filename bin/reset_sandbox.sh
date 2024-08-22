#!/bin/bash
# Set up the sandbox directory as a repo with some sample activity.
set -e

DIR='sandbox'

if [[ -d "$DIR" ]]; then
  rm -rf "$DIR"
fi

git init "$DIR" --quiet
cd "$DIR"

# Create a commit, so that the extension can run diff-index, which requires an
# initial commit.
echo '# Sandbox' >'README.md'
echo 'console.log("Hello, Foo!");' >foo.js
echo 'console.log("Hello, Fizz!");' >fizz.js
echo 'console.log("Hello, Buzz!");' >buzz.js
echo 'console.log("Hello, Bazz!");' >bazz.js
git add -A
git commit -m "Initial commit in $DIR"

# Modify.
echo 'console.log("Hello, Foobar!");' >>foo.js
# Add.
echo 'console.log("Hello, Bar!");' >bar.js
# Rename
mv fizz.js fizzy.js
# Move
mkdir -p my_subdir
mv bazz.js my_subdir
# Delete.
rm buzz.js

# Special characters.
echo '# Special characters' >'spëcial châracters.md'

echo '---'
git -c 'core.quotePath=false' status --short
echo '---'
git -c 'core.quotePath=false' diff-index --name-status --find-renames --find-copies --no-color HEAD
