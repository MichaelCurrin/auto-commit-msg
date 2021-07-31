# Terminal hook
> Setup and use a prepare-commit-msg hook for terminal commits

**Note** Using this script outside of the extension is on the roadmap but not done yet.

You can use the core logic of this project _without_ using the VS Code Git extension pane. You can use it in a standalone terminal or another IDE's integrated terminal.


## Warning

While VS Code does in fact honor a `prepare-commit-msg` hook, unfortunately

- The hook **cannot** read from the UI message box and
- The message is _always_ written out without confirmation.

So use an enable commit hook message hook inside VS Code with caution, but outside VS Code you are safe.

### Alias

Another way around the issue in VS Code, is instead of using a commit hook, rather use an **alias** command like `git c` - see the [Shell README](/shell/README.md) for alias instructions. That could run the Auto Commit Msg script and pass the result to `git commit -m '...'`. Also, a hook only works when set up in a project, while an alias can work anywhere.


## Reference

Here is the flow for using any `prepare-commit-msg` hook, not specific to this project:

1. Edit a file in your project.
1. Commit on command-line.
1. Prepare a commit message (this internally can look for the template as per the sample).
1. Override value with own message if desired.
1. Exit message editor view.
1. Commit is made.
1. Hook runs and the user sees a prepared message.


## Installation

Note that, in the future, the installation steps here will change and be split into maybe a separate installation doc. One part is installing the hook in any repo using a file built with GH actions. Another is to build and use the file by hand, which is simpler to set up and will be become a development doc step once actions have been set up.

### Install system dependencies

Install Node.js - see [instructions](https://gist.github.com/MichaelCurrin/aa1fc56419a355972b96bce23f3bccba).

### Clone

```sh
$ git clone git@github.com:MichaelCurrin/auto-commit-msg.git
$ cd auto-commit-msg
```

### Install hook

Notes:

- This flow covers how to add an executable script as a **git hook** in a project. This project was initially built around the Bash scripts in [shell](/shell/) as a proof of concept and you can continue to use one of those. Also, there was an idea to turn this TypeScript code from VS Code extension and re-purpose it as a standalone git hook for terminal use - but that doesn't work nicely in VS Code because a message hook ignores what you type in the message box and uses the hook's logic only.
- This is very general for now - there is no Node or compile build step.

For working on this project, set up a symlink from a hook in the repo to exist in `.git/hooks` directory. Adjust the first script name and path as needed but the last value must stay as is to be recognized by git.

```sh
$ (cd .git/hooks && ln -s -f ../../prepare-commit-msg prepare-commit-msg)
```

Use `-f` to overwrite the existing file.

A `-r` relative flag would make this shorter but it is not standard across Linux and Bash.

Check it:

```sh
$ ls -l .git/hooks
```

For other projects using this repo's hook - use `cp` or `curl` to add the hook to your repo. Or package and an installable Zip.

Instructions to follow as this develops.


## Disable

Remove the hook:

```sh
$ rm .git/hooks/prepare-commit-msg
```


## Usage

Perform a commit in the terminal. You'll see the prepared message appear.

```sh
$ git commit
$ git log
```
