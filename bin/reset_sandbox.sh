#!/bin/sh
# Set up the sandbox directory.
set -e

DIR='sandbox'

if [[ -d "$DIR" ]]; then
  rm -rf "$DIR"
fi

git init "$DIR" --quiet
cd "$DIR"

# Create a commit, so that the extension can run diff-index, which requires an
# initial commit.
echo "# Sandbox\n" >'README.md'
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
