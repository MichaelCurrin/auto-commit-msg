# Auto Commit Message
> Automagically generate a commit message - based on which files changed and how they changed

![Node CI](https://github.com/MichaelCurrin/auto-commit-msg/workflows/Node%20CI/badge.svg)

_Note: This project is in development - it is very unstable and unpredictable but you can use the scripts or docs if they make sense to you._


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
- I then used parts of [Git Semantic Commit](https://github.com/nitayneeman/vscode-git-semantic-commit), especially the `Git` API for adapting `status` from `diff`. This also gave me an outline of how to use tests (`mocha` in this case) for my own logic.
- There is also a much simpler and more relevant extension - [https://github.com/srmeyers/git-prefix](https://github.com/srmeyers/git-prefix) or the fork [d3skdev/git-prefix](https://github.com/d3skdev/git-prefix). This pushes a message to the commit message UI box and allows manual overrides, which is a flow I like. This could work with the existing Semantic Git Commit extension if that message is kept when opening up the picklist for type. Also I have a plan to add semantic prefix using my own logic, for some cases.
- The [parse-git-status](/src/generate/parse-git-status) module was based on [jamestalmage/parse-git-status](https://github.com/jamestalmage/parse-git-status), but with a different approach and some functionality left out (ignored and untracked files which would not be committed) and with added TS types so it can be used here.
