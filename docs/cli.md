# CLI
> How to use AutoCommitMsg in the terminal instead of as an extension

See steps below to setup and run the tool in the CLI. VS Code is not needed.

For development, see [CLI Development](development/cli.md).

## Requirements

- Node (see version in [package.json](/package.json))
- Git

_This should work on Windows too but has not been tested yet._

## Setup

### Clone the repo

```sh
$ git clone git@github.com:MichaelCurrin/auto-commit-msg.git
$ cd auto-commit-msg
```

### Install dependencies

```sh
$ npm ci
```

### Build and link the CLI tools

```sh
$ npm run cli
```

Verify installation:

```sh
$ acm -h
$ gacm -h
```

## Usage

Use the `-h` or `--help` flags with any of these to avoid making changes.

<!--
TODO consolidate to one command with commit flag or dry run?
TODO pass params like file names through for either command. For message and committing. The downside is for new files - even if git commit would pick them up by name, diff-index would not. You can also use whatever IDE to stage and still generate+commit with the CLI.
TODO -c not just --cached but pass through as --cached.
-->

### Generate a message from changes and commit

This is the **main** command you should use.

Note this actually **commit**, so if you want to experiment with commit output **without** committing, use the command below instead.

No flags are needed.

```sh
$ gacm
```

### Check Git changes and generate commit message

This will **not** commit.

No flags are needed.

```sh
$ acm
```

### Generate a message from staged changes

This is a simpler command which does not interact with Git, intended for integrating with the Bash shell.

See [shell/acm.sh](/shell/acm.sh) if you want to use that script or write your own shell script. That relies on using this executable Node script

```sh
$ auto_commit_message_generate "$CHANGES"
```

### Usage tips

The behavior depends on how Git treats files, so you should know these points:

- The commands will pick up on staged changes and certain unstaged changes (modified and deleted, but not created as they are untracked).
- If you want to handle created files, make sure to stage them first.
- If you want to target only select changes for smaller commit, then stage stages and use the `--cached` flag to ignored unstaged changes.

## Uninstall the linked CLI (optional)

If you get permission denied error, you can do this and then go back to the install step.

```sh
$ npm unlink -g auto-commit-msg
```
