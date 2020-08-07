# Installation


## Setup VS Code extension

This project in installable as a VS Code extension.

For now it is only available for dev testing but eventually will be installable for anyone using a download file (maybe even using the marketplace).

Here are the dev setup steps:


### Install system dependencies.

Install Node.js.

### Clone

```sh
$ git clone git@github.com:MichaelCurrin/auto-commit-msg.git
$ cd auto-commit-msg
```

### Install project dependencies

```sh
$ npm install
```


Continue to [usage](usage.md) doc.


## Setup hook for terminal commits

_This flow covers how to add an executable script as a git hook in a project. This project was initially built around the Bash scripts in [shell](/shell/) as a proof of concept and you can continue to use one of those. But the idea is that eventually the TypeScript code used to make the VS Code extension can be repurposed as a standalone git hook for terminal use._

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

You can now run a commit in the terminal and you'll see the prepared message appear.

```sh
$ git commit FILE
```

For other projects using this repo's hook - use `cp` or `curl` to add the hook to your repo. Or package and an installable Zip.

Instructions to follow as this develops.
