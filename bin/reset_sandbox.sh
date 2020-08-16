#!/bin/sh
set -e

if [ -d sandbox ]; then
    rm -rf sandbox
fi

git init sandbox --quiet
cd sandbox
echo "# Sandbox\n" >'README.md'
git add -A
git commit -m 'Initial commit in sandbox'
