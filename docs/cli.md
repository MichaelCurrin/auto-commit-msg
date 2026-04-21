# CLI
> How to use AutoCommitMsg in the terminal instead of as an extension

This gives flexibility so you don't want to use VS Code or if you want to use the terminal inside sidepanel for your commit workflow.

See steps below to setup and run the tool in the CLI.

> [!NOTE]
> For development, see [CLI Development](/docs/development/cli.md).

## Install

The pre-built binaries are added to releases on GitHub so you can install them without needing the project or Node.

macOS and Linux:

```sh
curl -fsSL https://raw.githubusercontent.com/MichaelCurrin/auto-commit-msg/refs/heads/master/bin/install_cli.sh | bash
```

**Warning this is experimental** Windows PowerShell:

```powershell
iwr https://github.com/username/repo/releases/latest/download/install.ps1 -useb | iex
```

> [!TIP]
> To setup as a **pre-commit hook**, see [Shell](/shell/)

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
