# status vs diff-index

Git subcommands used by this extension to check which filepaths changed and how they changed.

See [parseOutput.ts](/src/git/parseOutput.ts) module that handles output of two similar Git subcommands discussed below.


## History and motivation

This project was initially built around [status](#status), as that was the subcommand use by another extension that this extension was based on. But, now the [diff-index](#diff-index) approach is used instead.

Using `status` is friendly for everyday use as developer. The `diff-index` subcommand is not for everyday use - you can to add a path like `HEAD` and you need to add flags to get sensible output.

Both `status` and `diff-index` can be used to see a list of paths and how they changed, using `from` and `to` as a pair of paths when moving or renaming a file.

Why use `diff-index` and not `status`? Using the former makes things more **predictable** when parsing output. Since the `from` file is always first, from left to right. While `status` has it on the right, which is hard because it is not always there. There might be other reasons I can't remember, maybe because there is a percentage similarity which shows up in `diff-index` for renames/moves.


## status

The well-known `git status` subcommand.

```sh
$ git status [FLAGS] --short
```

> git-status - Show the working tree status

e.g.

```console
$ git status
    modified:   abc.txt
$ git status --short
 M abc.txt
```


## diff-index

The less-known `git diff-index` subcommand. This is not so usable for day to to day use in the CLI but is great for scripts or for a project such as this one.

```sh
$ git diff-index [FLAGS] PATH
```

> Compare a tree to the working tree or index

- Flags must appear before the path.
- Use `--cached` for staged changes _only_. Note that the only way to pick up new file or detect a move/rename pair properly with `diff-index` is to stage changes first and then use this flag.
- The path is required - `HEAD` works fine.

e.g.

```console
$ git diff-index HEAD
$ :100644 100644 e69de29bb2d1d6434b8b29ae775ad8c2e48c5391 0000000000000000000000000000000000000000 M      abc.txt
$ git diff-index --name-status HEAD
M       abc.txt
```

### Limitation of diff-index

#### Summary

New files and moved/renamed files _always_ need to be staged for `git diff-index` to see them. Just remember to do this yourself, because the extension won't see the `U` untracked files otherwise.

I consider this is an acceptable limitation of functionality to keep the extension code simple.

#### Details

The `diff-index` subcommand cannot see new or moved/renamed files, unless you stage them. Which is okay, because you just need to stage a file and then the extension can see it.

And in the case of renaming/moving files, there's a limitation of git that can't be overcome - you need to **stage** the old and new paths anyway for `git` to see them as **one file**, regardless of using `status` or `diff-index`.

The `git status` subcommand _can_ handle new _untracked_ files. But the effort to rewrite a chunk of the extension to use a different Git subcommand is not worth it, and won't solve the rename/move case anyway.

So we just keep things simple to avoid bloating the codebase (adding the ability to use two similar subcommands and handle them both well is not sensible when one subcommand works great for most things).

You can still do what you need to - just remember to stage files if you need the extension to recognize them.
