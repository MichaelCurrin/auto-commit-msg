# Auto Commit Message
> Automagically generate a commit message - based on which files changed and how they changed

[![Node CI](https://github.com/MichaelCurrin/auto-commit-msg/workflows/Node%20CI/badge.svg)](https://github.com/MichaelCurrin/auto-commit-msg/actions)
[![GitHub tag](https://img.shields.io/github/release/MichaelCurrin/auto-commit-msg?include_prereleases&sort=semver)](https://github.com/MichaelCurrin/auto-commit-msg/tags/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](#license)

[![VS Code extension](https://img.shields.io/badge/VS_Code_extension-blue.svg)](https://code.visualstudio.com/)
[![Made with TypeScript](https://img.shields.io/badge/Made_with-TypeScript-blue.svg)](https://typescriptlang.org)


VS Code extension which provides smart suggestions for your commit messages.


## Purpose

This is a VS Code extension - when you run it, it will look at files changed and then generate a commit message for you and add it to the commit message box (using the Git Extension's UI). 

It will look at files that are staged. If there are none, then it will look all changed unstaged files instead. The result will be a simple, descriptive message that fits on one line.

Note: At the moment a message can be generated based on one changed file.

The idea of this tool is to take the friction out of writing commit messages, so you that you commit more frequently (such as a with more one-line changes rather than mixing multiple unrelated changes together) and to save having to type out details that can be automatic or a tedious (mentioning long or difficult-to-type paths or filenames). This tool is not mean to be perfect - it gives a best guess for common cases. 

It also not meant to replace writing messages by hand. It is a tool for myself mainly - 80% of my commit messages could have been written by an algorithm. 

And for the other 20% when the change is important to describe in detail or hard to figure out programmatically (like class renames or bug fix descriptions), then I can still write my manual commit message.

This tool was inspired partly by GitHub's UI - it suggests a message in grey like "Update README.md" when I edit that file and if I enter nothing it uses that.

There are many tools out there that will _lint_ your commit message, or provide you a multi-line template, or will insert something in it like "feat:" or an emoji. But AutoCommitMsg writes you entire commit message for you in one line.


## Notes

This project is in development - it is very unstable and unpredictable but you can use the scripts or docs if they make sense to you. The focus has shifted away from making a terminal hook because VS Code handles is weirdly and on every UI commit, even if you only plan use it on the terminal.

I am please to announced that this now a lot more stable as of `v0.7.0`, but is not production ready (mainly cosmetic issues and a need to smooth the packaging flow). Next are items in GH issues, unchecked features list below, a local TODO file, some Semantic functions to use and some renaming tests to work on.

This is my first VS Code extension and first TypeScript project, so I am learning as a go and trying to follow best practices I find.


## Features

- [x] VS Code extension
- [x] Installable from archive file (see _assets_ list under latest [release](https://github.com/MichaelCurrin/auto-commit-msg/releases))
- [x] Handle staged files or working tree
- [x] Write a single-line commit message for a git repo (e.g. `Create`, `Update`, `Delete`)
- [x] Handle changes from a single changed file
- [ ] Handle changes from two or more files e.g. `Update 3 files in foo`, `Create foo.txt and fizz/bar.txt`, `Create foo.txt and delete bar.txt`
- [ ] Keep user-entered value as a prefix e.g. Keep `docs:` (or ticket number) so message becomes `docs: Update README.md`
- [ ] Use semantic prefix / conventional commits e.g. `chore: Update package.json`

### Structure

- [x] Works with git repos
- [x] Test coverage - Unit tests that are run with GitHub Actions CI
- [ ] Available in VS Code marketplace 
- [ ] CI to build the package archive on tag


## Project plan

This project is a work in progress. It is starting out as a specification of the desired behavior on the [Wiki](https://github.com/MichaelCurrin/auto-commit-msg/wiki), then will tests added and then only the functionality last.

This will probably be in Python for easy scaling and tests. And it will probably use git commit hooks - whatever I find works well for command-line use and also VS Code messages if left blank but allowing manual overrides. And ideally showing the message just before its made so one can confirm. But this may be reaching too much especially for two entry methods. Maybe it can be generated when files are staged based on an event in VS Code.


## Documentation

[Project docs](/docs/) folder

[Project Wiki](https://github.com/MichaelCurrin/auto-commit-msg/wiki)


## License

Released as [MIT](/LICENSE).

The core of this project's VS Code extension logic is creating a commit message and pushing to the Git Extension input box in the UI. That comes from the Git Prefix extension, covered below.

Sources:

- Hello World sample
    - Source: [Hello World test sample](https://github.com/microsoft/vscode-extension-samples/tree/master/helloworld-test-sample) project
    - This project started off as an extension based on the VS Code test sampke. It was just hello world and didn't help with my flow, so I got rid of the code in later tags.
- Git Semantic Commit
    - Repo: [nitayneeman/vscode-git-semantic-commit](https://github.com/nitayneeman/vscode-git-semantic-commit) 
    - I liked how this extension does Git CLI commands, so I used the original [Git](https://github.com/nitayneeman/vscode-git-semantic-commit/blob/master/src/git.ts) class and `getWorkspaceFolder`. That served the based for my functionality in [gitCommands.ts](/src/gitCommands.ts), which allowed my `extension.ts` script to work as I wanted.
    - The rest of the extension was too advanced for what I needed to do, so I ended up not using the other parts.
    - I like the integration tests approach though so I might come back to use pieces of that.
- Git Prefix
    - Repos: [srmeyers/git-prefix](https://github.com/srmeyers/git-prefix) or the fork [d3skdev/git-prefix](https://github.com/d3skdev/git-prefix). 
    - I found this in the marketplace - it adds a _branch prefix_ to commit message UI box and gives the user a chance to read it and edit it. This is very close to the flow that I want and it far less code that Git Semantic Commit, so my extension is based on this. See for example the use of `repository.inputBox.value` in [extension.ts](/src/extension.ts).
- Parse Git Status
    - Repo: [jamestalmage/parse-git-status](https://github.com/jamestalmage/parse-git-status)
    - I started out parsing git status output (not diff-index), intending to use this NPM package. Unfortunately it does not come with types and I couldn't figure out how to add types, so I took the logic from it and rewrote it as my own so it is easier to manage and extend. See my [parse-git-output](/src/generate/parse-git-output) module - that based on `parse-git-status`.
    - My enhancements:
        - Compatible with git status `--porcelain` flag.
            - Replaced use of `-z` mode. As I not like separating by either one _or_ two null characters and how the original package did this splitting. So I split columns by whitespace rather and had lines split by newline character (for when more than one files changes or there is a trailing line).
        - Cleaner `for` loop logic
            - I found the original hard to work on because of how it uses an old-style `for` loop and `i` variable.
            - I found using `.split` with a regex pattern was much simpler.
        - Added TS types (essential for my project to run).
        - My module handles output of both `git status [FLAGS] --short` and `git diff-index [FLAGS] HEAD`.
