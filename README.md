# Auto Commit Message
> Automagically generate a commit message - based on which files changed and how they changed

![Node CI](https://github.com/MichaelCurrin/auto-commit-msg/workflows/Node%20CI/badge.svg)

_Note: This project is in development - it is very unstable and unpredictable but you can use the scripts or docs if they make sense to you. The focus has shifted away from making a terminal hook because VS Code handles is weirdly and on every UI commit, even if you only plan use it on the terminal_


## Project plan

This project is a work in progress. It is starting out as a specification of the desired behavior on the [Wiki](https://github.com/MichaelCurrin/auto-commit-msg/wiki), then will tests added and then only the functionality last.

This will probably be in Python for easy scaling and tests. And it will probably use git commit hooks - whatever I find works well for command-line use and also VS Code messages if left blank but allowing manual overrides. And ideally showing the message just before its made so one can confirm. But this may be reaching too much especially for two entry methods. Maybe it can be generated when files are staged based on an event in VS Code.


## Documentation

[Project docs](/docs/) folder

[Project Wiki](https://github.com/MichaelCurrin/auto-commit-msg/wiki)


## License

Released as [MIT](/LICENSE).

Sources:

- This extension started off with the VS Code hello world test sample.
- Then I used parts of [Git Semantic Commit](https://github.com/nitayneeman/vscode-git-semantic-commit), mainly the `Git` API for adapting `status` from `diff`. This also gave me an outline of how to use tests (`mocha` in this case) for my own logic.
- I found a much simpler and much more relevant extension - [https://github.com/srmeyers/git-prefix](https://github.com/srmeyers/git-prefix) or the fork [d3skdev/git-prefix](https://github.com/d3skdev/git-prefix). This will push a message to the commit message UI box and allows manual overrides, which is a flow I like. That could work with the existing Semantic Git Commit extension if that message is kept when opening up the picklist for type. Also I have a plan to add semantic prefix using my own logic, for some cases.
- The [parse-git-output](/src/generate/parse-git-output) module was based on [jamestalmage/parse-git-status](https://github.com/jamestalmage/parse-git-status), but I rewrote from scratch. My enhancements:
    - Cleaner logic (not use of `i` and `i++` or splitting by `\n`, I rather just use `\n` which is always at the end unless you somehow use `\n` in your filename).
    - Compatibility with `--porcelain` instead of `-z`.
    - Added TS types (essential for my project to run)
    - Mine handles both `git status` and `git diff-index` output.
