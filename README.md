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

This extension started off with the VS Code hello world test sample.

Then it was extended to have source control button and commit flow, based on [Git Semantic Commit](https://github.com/nitayneeman/vscode-git-semantic-commit). See [LICENSE-source](LICENSE-source).
