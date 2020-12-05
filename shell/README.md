# Shell

Git hook test scripts.

All the scripts in this directory are named with dashes not underscores, to match the git hook filenames convention.


## Samples

Archive of shell scripts for reference. These are used in the early development of the project but are not actively used.

- [count-files.sh](count-files.sh)
- [sample.sh](sample.sh)
- [simple-hook.sh](simple-hook.sh)


## Autofill scripts

These integrate with the JS scripts in this project, as an alternative to VS Code so I can use it any terminal and in other IDEs with terminals. And if I stop using VS Code completely I can keep the core use at least in a terminal.

- [autofill-hook.sh](autofill-hook.sh)
- [autofill.sh](autofill.sh)

They are not complete but work as a POC for using the core logic outside project outside of VS Code as git hook.

### Dev notes

Remember to compile before running this script to get latest changes.

#### Purpose

This script should be used as **alternative** to using VS Code itself to handle your commit messages, as VS Code does not support a hook properly when going through the UI box (it **ignores** any message you type in and uses its own generated message from the hook).

But, if you don't use it as an actual hook, there an alternative flow that doesn't mess with VS Code. You can use the other script and setup a git alias (which can be used across projects without setting a hook even).

```sh
./shell/autofill.sh
```

Set this up in git config aliases as `c` or something. If this was in a _bin_ directory, or used with an absolute path to the script. The

```toml
[alias]
    c = "! git commit --edit -m $(autofill.sh)"
```

Then instead of `git commit`, you do:

```sh
$ git c
$ git c foo.txt
```

#### TODO

**TODO** For now this points to the output directory so it limited in real world use. This is stepping
stone. But ideally the JS files can be copied outside of this project to a central location (maybe
with a bin entry point). And the SH script can be added to an individual project in .git/hooks dir as `prepare-commit-msg`.

**TODO** When using this as a hook, consider reading from the existing commit message file in the case
of template, so it that can be passed on.
