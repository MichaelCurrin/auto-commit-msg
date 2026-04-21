# CLI
> How to use AutoCommitMsg in the terminal instead of as an extension

See steps below to setup and run the tool in the CLI. VS Code is not needed.

For development, see [CLI Development](development/cli.md).

_This should work on Windows too but has not been tested yet._


## Install

Requires Git and Node.

<!-- TODO replace with instructions for **downloading** from a release using manual steps and install with curl or npm
Note you do not need Git or Node, you can download the pre-packaged CLI tool as a binary.

For now:

npm run cli:build
command cp -f build-cli/acm-macos ~/.local/bin/acm
command cp -f build-cli/gacm-macos ~/.local/bin/gacm

-->

```sh
$ git clone git@github.com:MichaelCurrin/auto-commit-msg.git
$ cd auto-commit-msg
$ npm install
$ npm run cli:install
```

To setup as a pre-commit hook, see [Shell](/shell/)

## Usage

Use the `-h` or `--help` flags with any of these to avoid making changes.

<!--
TODO consolidate to one command with commit flag or dry run?
TODO pass params like file names through for either command. For message and committing. The downside is for new files - even if git commit would pick them up by name, diff-index would not. You can also use whatever IDE to stage and still generate+commit with the CLI.
TODO -c not just --cached but pass through as --cached.
    And use default behavior for if there is staged then use that for commit message - make it smart.
-->

### Generate a message from changes and commit

This is the **main** command you should use.

Note this will **commit**, so if you want to experiment with commit output **without** committing, use the command below instead.

No flags are needed.

```sh
$ gacm --help
```

### Check Git changes and generate commit message

This will **not** commit.

No flags are needed.

```sh
$ acm --help
```

### Generate a message from staged changes

This is a simpler command which does not interact with Git, intended for integrating with the Bash shell.

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
