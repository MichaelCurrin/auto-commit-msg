# Auto Commit Message
> Automagically generate a commit message - based on which files changed and how they changed

![Node CI](https://github.com/MichaelCurrin/auto-commit-msg/workflows/Node%20CI/badge.svg)

- Made with: TypeScript
- Made for: VS Code


## Purpose

This is a VS Code extension - when you run it, it will look at files changed and then generate a commit message for you and add it to the commit message box (using the Git Extension's UI). It will look at files that are staged. If there are none, then it will look all changed unstaged files instead. The result will be a simple, descriptive message that fits on one line.

_\*At the moment a message can be generated based on one changed file_

This was inspired partly by GitHub's UI - it suggests a message in grey like "Update README.md" when I edit that file and if I enter nothing it uses that.

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
- [ ] Handle changes from two or more files
- [ ] Keep user-entered value as a prefix
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
    - Source: [hello world test sample](https://github.com/microsoft/vscode-extension-samples/tree/master/helloworld-test-sample)
    - This project started off as an extension based on the VS Code test sampke. It was just hello world and didn't help with my flow, so I got rid of the code in later tags.
- Git Semantic Commit
    - Repo: [nitayneeman/vscode-git-semantic-commit](https://github.com/nitayneeman/vscode-git-semantic-commit) 
    - Then I used parts of that, mainly the `Git` API for adapting `status` from `diff`. 
    - That also gave me an outline of how to use tests (`mocha` in this case) for my own logic.
- Git Prefix
    - I found a much simpler and much more relevant extension.
    - [srmeyers/git-prefix](https://github.com/srmeyers/git-prefix) or the fork [d3skdev/git-prefix](https://github.com/d3skdev/git-prefix). 
    - This will push a message to the commit message UI box and allows manual overrides, which is a flow I like. That could work with the existing Semantic Git Commit extension if that message is kept when opening up the picklist for type (the problem is that that extension does not use the message but its own field). Also I have a plan to add semantic prefix using my own logic, for some cases. This see the `Semantic` class.
- Parse Git Status
    - Repo: [jamestalmage/parse-git-status](https://github.com/jamestalmage/parse-git-status)
    - Parsing the git output started with the Parse Git Status described below but diverged.
    - My [parse-git-output](/src/generate/parse-git-output) module was based on `parse-git-status`, but I rewrote from scratch. 
    - My enhancements:
        - Compatibility with `git status --porcelain`.
            - Replace use of `-z` mode. Separating by either one or two null characters is not nice, so I split columns by whitespace rathe and lines split by newline character.
        - Cleaner for loop logic
            - I found the original hard to work on because of how it uses an old-style `for` loop and `i` variable and expects elements t
        - Added TS types (essential for my project to run)
        - It now handles output of both `git status --short` and `git diff-index HEAD`.
