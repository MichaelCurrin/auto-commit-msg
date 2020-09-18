# Auto Commit Message ⚙️🧙‍♂️ ✉️
> Automagically generate a commit message - based on which files changed and how they changed

[![Node CI](https://github.com/MichaelCurrin/auto-commit-msg/workflows/Node%20CI/badge.svg)](https://github.com/MichaelCurrin/auto-commit-msg/actions)
[![GitHub release](https://img.shields.io/github/release/MichaelCurrin/auto-commit-msg?include_prereleases&sort=semver)](https://github.com/MichaelCurrin/auto-commit-msg/releases/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](#license)

[![VS Code Extension](https://img.shields.io/badge/VS_Code_Extension-blue.svg?logo=visual-studio-code)](https://code.visualstudio.com/)
[![Made with TypeScript](https://img.shields.io/badge/TypeScript-3-blue.svg?logo=typescript)](https://typescriptlang.org)

A VS Code extension which provides smart suggestions for your commit messages.

## About

It can **describe a change** for a single file. Including create, update, remove, rename and move. See the [tests](https://github.com/MichaelCurrin/auto-commit-msg/blob/master/src/test/message.test.ts).

And it can use an appropriate **semvar** label in many cases. It can't separate features and bug fixes but it can identify changes to docs, CI files and package or config files.

## Example

- You created a new file `foo.js`. The extension writes `feat: Create foo.js`.
- If you updated your `Makefile`. Then extension writes `chore: Update Makefile`.
- You updated a file in the docs directory. Message generated is `docs: Update bar.md`.


## Release disclaimer

- This application is still in **pre-release** stage. 
- But... it is functional and I use it daily, so please use it too if you want.
- There are just some finishing touches still, like making a new logo, releasing the package on the marketplace and cleaning up the docs. It can become version `1.0.0` around then.
- There are also a bunch of issues I want to work through to extend functionality to make the extension smarter.


## Purpose

This is a VS Code extension - when you run it, it will look at files changed and then generate a commit message for you and add it to the commit message box (using the Git Extension's UI). 

It will look at files that are staged. If there are none, then it will look all changed unstaged files instead. The result will be a simple, descriptive message that fits on one line.

Note: At the moment a message can be generated based on one changed file.

The idea of this tool is to take the friction out of writing commit messages, so you that you commit more frequently (such as a with more one-line changes rather than mixing multiple unrelated changes together) and to save having to type out details that can be automatic or a tedious (mentioning long or difficult-to-type paths or filenames). This tool is not mean to be perfect - it gives a best guess for common cases. 

It also not meant to replace writing messages by hand. It is a tool for myself mainly - 80% of my commit messages could have been written by an algorithm. 

And for the other 20% when the change is important to describe in detail or hard to figure out programmatically (like class renames or bug fix descriptions), then I can still write my manual commit message.

This tool was inspired partly by GitHub's UI - it suggests a message in grey like "Update README.md" when I edit that file and if I enter nothing it uses that.

There are many tools out there that will _lint_ your commit message, or provide you a multi-line template, or will insert something in it like "feat:" or an emoji. But AutoCommitMsg writes you entire commit message for you in one line.

<!--
## Notes

This project is in development - it is very unstable and unpredictable but you can use the scripts or docs if they make sense to you. The focus has shifted away from making a terminal hook because VS Code handles is weirdly and on every UI commit, even if you only plan use it on the terminal.

I am please to announced that this now a lot more stable as of `v0.7.0`, but is not production ready (mainly cosmetic issues and a need to smooth the packaging flow). Next are items in GH issues, unchecked features list below, a local TODO file, some Semantic functions to use and some renaming tests to work on.

This is my first VS Code extension and first TypeScript project, so I am learning as a go and trying to follow best practices I find.
-->

## Features

What this VS Code extension can do

- [x] Installable from archive file (see _assets_ list under latest [release](https://github.com/MichaelCurrin/auto-commit-msg/releases))
- [x] Handle staged files or working tree
- [x] Write a single-line commit message for a git repo (e.g. `Create`, `Update`, `Delete`)
- [x] Handle changes from a single changed file
- [ ] Handle changes from two or more files e.g. `Update 3 files in foo`, `Create foo.txt and fizz/bar.txt`, `Create foo.txt and delete bar.txt`
- [ ] Keep user-entered value as a prefix e.g. Keep `docs:` (or ticket number) so message becomes `docs: Update README.md`
- [ ] Use semantic prefix / conventional commits e.g. `chore: Update package.json`

### Structure and admin

- [x] Works with git repos
- [x] Test coverage - Unit tests that are run with GitHub Actions CI
- [ ] Update logo
- [ ] Available in VS Code marketplace 
- [ ] CI to build the package archive on tag
- [ ] Clean up docs and Wiki


## Project plan

This project is a work in progress. It is starting out as a specification of the desired behavior on the [Wiki](https://github.com/MichaelCurrin/auto-commit-msg/wiki), then will tests added and then only the functionality last.

This will probably be in Python for easy scaling and tests. And it will probably use git commit hooks - whatever I find works well for command-line use and also VS Code messages if left blank but allowing manual overrides. And ideally showing the message just before its made so one can confirm. But this may be reaching too much especially for two entry methods. Maybe it can be generated when files are staged based on an event in VS Code.


## Documentation

[Project docs](/docs/) folder

[Project Wiki](https://github.com/MichaelCurrin/auto-commit-msg/wiki)


## License

Released as [MIT](/LICENSE).

The core of this project's VS Code extension logic is creating a commit message and pushing to the Git Extension input box in the UI. That comes from the Git Prefix extension. Use of Git CLI in the extension comes from the Semantic Git Commit extension. Read about these in the [Credit](/docs/credit.md) section the docs.
