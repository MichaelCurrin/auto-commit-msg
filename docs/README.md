# Documentation - Auto Commit Message

This project aims to prepare a smart commit message for you to make your development smoother.


## Overview

- Install a pre-built extension
    - See [Quickstart](quickstart.md)
- For developers
    - Start with [installation](installation.md) to install.
    - Continue to [development](development.md) doc for local development.
    - See the [package](package.md) doc to roll your own copy and install it, using single command.


## Philosophy

This repo is based on the practice of small, frequent, atomic commits such that it easy to rollback to a work state when developing (such as stashing uncommitted changes), or rolling back a deploy to an earlier commit (or using a revert commit).

If there is too much friction in creating a commit message, then I find myself putting off a few changes and then I have 5 files changes for different reasons and sometimes multiple tangle changes within each file.

So it makes sense for my approach to have a magical way to generate a commit message for a change in one or two files, commit and then keep going. Which is where this extension comes in.

Yes sometimes you need to rename a variable across 10 files and then a manually-typed message makes sense. Or you add a function and use it at 3 levels, or you fix the same bug in multiple places. Then please go ahead and don't use the pre-filled message.

But if your commit style is somewhat like mine, you'll find that 80% of he commit messages you write can be generated programmatically, especially for one file or one line changes. This keeps your commit flow smooth and keeps you in a state of writing code and solving problems, not feeling interrupted to write meaningful messages or type out precise file names.

Also, the atomic approach doesn't have to be followed strictly. Sometimes I add tests and functions in one commit. Sometimes tests first and functions in a later commit to make the tests pass.

<!--

The docs are split into two features:

- [Extension](extension.md)
- [Terminal hook](terminal-hook.md)

Part ideas:

- A shell script in a repo
- References a concatenated JS script from this repo (just the text handling and not the full extension), which is in a bin directory.

-->
