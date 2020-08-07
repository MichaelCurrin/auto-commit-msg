# Auto Commit Message
> Automagically generate a commit message - based on which files changed and how they changed

**This project is in development - it is very unstable and unpredictable but you can use the scripts or docs if they make sense to you.**

## Project plan

This project is a work in progress. It is starting out as a specification of the desired behavior on the [Wiki](https://github.com/MichaelCurrin/auto-commit-msg/wiki), then will tests added and then only the functionality last.

This will probably be in Python for easy scaling and tests. And it will probably use git commit hooks - whatever I find works well for command-line use and also VS Code messages if left blank but allowing manual overrides. And ideally showing the message just before its made so one can confirm. But this may be reaching too much especially for two entry methods. Maybe it can be generated when files are staged based on an event in VS Code.


## Documentation

[Project docs](/docs/) folder

[Project Wiki](https://github.com/MichaelCurrin/auto-commit-msg/wiki)


### VS Code extension

Still in development.


#### Setup

Run `npm install` in terminal to install dependencies


#### Usage

Run the `Run Extension Tests` target in the Debug View. This will:

- Start a task `npm: watch` to compile the code
- Run the extension integration test in a new VS Code window

#### Tests


Unit tests.

```sh
$ npm run test:unit
```

Run the pretest and unit test steps.

```sh
$ npm test
```

Run VS Code extention tests.

NB. VS Code will be downloaded and run against the code. You will get errors unless you close VS Code first.

```sh
$ npm run test:integration
```


## License

Released as [MIT](/LICENSE).

This extension started off with the VS Code hello world test sample.

Then it was extended to have source control button and commit flow, based on [Git Semantic Commit](https://github.com/nitayneeman/vscode-git-semantic-commit). See [LICENSE-source](LICENSE-source).
