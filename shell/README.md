# Shell

Bash scripts around this project.

All the scripts in this directory are named with dashes and not underscores, to match the Git hook filenames convention.


## Samples

Archive of shell scripts for reference. These are used in the early development of the project but are not actively used.

- [count-files.sh](count-files.sh)
- [sample.sh](sample.sh)
- [simple-hook.sh](simple-hook.sh)


## Autofill scripts

These are shell scripts to integrate with the JS scripts in this project, as an alternative to using, VS Code so I can use it any terminal and in other IDEs with their terminals. And if I stop using VS Code completely I can keep using the core at least in a terminal.

- [autofill-hook.sh](autofill-hook.sh)
- [autofill.sh](autofill.sh)

They are not complete but work as a POC for using the core logic outside project outside of VS Code as Git hook.

### Dev notes

Remember to **compile** the TS to JS before running this script to get the latest changes. Or use a pre-compiled script.

#### Purpose

This script should be used as an **alternative** to using VS Code itself to handle your commit messages, as VS Code does not support a hook properly when going through the UI box (it actually **ignores** any message you type in and uses its own generated message from the hook).

But, if you don't use it as an actual hook, there is an alternative flow that doesn't mess with VS Code. You can use the other script and set up a Git alias (which can be used across projects without setting a hook even).

Sample output:

```console
$ ./shell/autofill.sh
chore: update settings.json
$ ./shell/autofill.sh
update 11 files
```

Use it with Git. This uses the tool to generate a message and pass it as the Git commit message, but forcing edit mode so you can override it.

```sh
$ git commit --edit -m "$(shell/autofill.sh)"
```

Move the script to a `bin` executables directory so you can run it from anywhere.

```sh
$ cp autofill.sh /usr/local/bin
```

TODO:

- Where to put the Node script so it can reference it.
- How to automated the install process for upgrades. Maybe the JS + shell script as NPM package or at least on GitHub with cURL install.
- Figure out how to switch between staged and not, with `--cached`. Like passing a param to the shell script and having two aliases. Or to have it as pass of the shell script to fallback to all if anything is staged. Or just control with filenames e.g. `git c .` or `git c package*` - oh wait, the shell script doesn't look at what is passed to `git commit`, only what is staged or not.

#### Alias

Set this up in git config aliases as `c` or something. If this was in a _bin_ directory, or used with an absolute path to the script.

```toml
[alias]
    c = '! git commit --edit -m "$(autofill.sh)"'
```

Then instead of `git commit`, you can do:

```sh
$ git c

$ git c foo.txt
```

#### TODO

- For now this points to the output directory so it limited in real world use. This is a stepping
stone. But ideally the JS files can be copied outside of this project to a central location (maybe
with a `bin` entry point). And the SH script can be added to an individual project in `.git/hooks` dir as `prepare-commit-msg`.
- When using this as a hook, consider reading from the **existing** commit message file in the case
of template, so it that can be passed on.
- Add a flag for staged to get `--cached` flag.
