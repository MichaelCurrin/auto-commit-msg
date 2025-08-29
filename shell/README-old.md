# Shell

Bash scripts around this project, to be used instead of as a VS Code extension.

<!-- TODO rewrite this content, remove, and move to src/bin -->

## Samples

Archive of shell scripts for reference. These are used in the early development of the project but are not actively used.

- [count-files.sh](count-files.sh)
- [sample.sh](sample.sh)
- [simple-hook.sh](simple-hook.sh)


## acm scripts

These are shell scripts to integrate with the JS scripts in this project, as an alternative to using, VS Code so I can use it any terminal and in other IDEs with their terminals. And if I stop using VS Code completely I can keep using the core at least in a terminal.

- [acm-hook.sh](acm-hook.sh)
- [acm.sh](acm.sh)

They are not complete but work as a POC for using the core logic outside project outside of VS Code as Git hook.

### Dev notes

Remember to **compile** the TS to JS before running this script to get the latest changes. Or use a pre-compiled script.

#### Purpose

This script should be used as an **alternative** to using VS Code itself to handle your commit messages, as VS Code does not support a hook properly when going through the UI box (it actually **ignores** any message you type in and uses its own generated message from the hook).

But, if you don't use it as an actual hook, there is an alternative flow that doesn't mess with VS Code. You can use the other script and set up a Git alias (which can be used across projects without setting a hook even).

Sample output:

```console
$ ./shell/acm.sh
chore: update settings.json
$ ./shell/acm.sh
update 11 files
```

Use it with Git. This uses the tool to generate a message and pass it as the Git commit message, but forcing edit mode so you can override it.

```sh
$ git commit --edit -m "$(shell/acm.sh)"
```

This can be done easier using the bin and alias steps below.

Move the script to a `bin` executables directory so you can run it from anywhere.

```sh
$ cp acm.sh /usr/local/bin
```

#### Alias

Set this up in git config aliases as `c` or something. If this was in a _bin_ directory, or used with an absolute path to the script.

```toml
[alias]
    c = '! git commit --edit -m "$(acm.sh)"'
```

Then instead of `git commit`, you can do:

```sh
$ git c

$ git c foo.txt
```
