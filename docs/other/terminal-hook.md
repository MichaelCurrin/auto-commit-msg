# Terminal hook
> Setup and use a prepare-commit-msg hook for terminal commits

**Note** Using this script outside of the extension is on the roadmap but not done yet.

You can use the core logic of this project without using the VS Code Git extension pane. You can use the terminal and that includes on in another IDE like PyCharm which has a terminal.


## Warning

While VS Code does actually honor a `prepare-commit-msg` hook, unfortunately the hook **cannot** read from the UI message box and the message is always written out with confirmation. So use an enable commit hook message hook inside VS Code with caution, but outside VS Code you are safe.

Another way around the issue in VS Code, is instead of using a commit hook that you rather use an alias command like `git c`, which could run the Auto Commit Msg script and pass the result to `git commit -m '...'`.


## Reference

Here is the flow for using any `prepare-commit-msg` hook, not specific to this project:

1. Edit file in your project.
1. Commit on command-line.
1. Prepare commit message (this internally can look for the template as per the sample).
1. Override value with own message if desired.
1. Exit message editor view.
1. Commit is made.
1. Hook runs and user see prepared message.


## Installation

Note that in future the installation steps here will change and be split into maybe a separate installation doc. On part is installing the hook in any repo using a file built with GH actions. Another is build and using the file by hand which is simpler to set up and will be become a development doc step once actions is setup.


### Install system dependencies

Install Node.js.


### Clone

```sh
$ git clone git@github.com:MichaelCurrin/auto-commit-msg.git
$ cd auto-commit-msg
```

### Install hook

Notes:

- This flow covers how to add an executable script as a **git hook** in a project. This project was initially built around the Bash scripts in [shell](/shell/) as a proof of concept and you can continue to use one of those. Also there was an idea to turn this TypeScript code from VS Code extension and re-purpose as a standalone git hook for terminal use - but that doesn't work nicely in VS Code because a message hook ignores what you type in the message box and uses the hook's own logic only.
- This is very general for now - there is no Node or compile build step.

For working in this project, set up a symlink from a hook in the repo to exist in `.git/hooks` directory. Adjust the first script name and path as needed but the last value must stay as is to be recognized by git.

```sh
$ (cd .git/hooks && ln -s -f ../../prepare-commit-msg prepare-commit-msg)
```

Use `-f` to overwrite existing file.

A `-r` relative flag would make this shorter but it is not standard across Linux and Bash.


Check it:

```sh
$ ls -l .git/hooks
```


For other projects using this repo's hook - use `cp` or `curl` to add the hook to your repo. Or package and an installable Zip.

Instructions to follow as this develops.


## Disable

```sh
$ git commit FILE
$ git log
```

Remove the hook.

```sh
$ rm .git/hooks/prepare-commit-msg
```




## Usage

You can now run a commit in the terminal and you'll see the prepared message appear.
