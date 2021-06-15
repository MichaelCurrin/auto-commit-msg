# status vs diff-index

Git subcommands used by this extension to check which filepaths changed and how they changed.

## Two subcommands

The [parseOutput.ts](/src/git/parseOutput.ts) handles output of two similar Git subcommands.

The well-known `status` command.

```sh
$ git status [FLAGS] --short
```

> git-status - Show the working tree status

And the lesser-known `diff-index` command.

```sh
$ git diff-index [FLAGS] HEAD
```

> Compare a tree to the working tree or index

This project was initially built around `status`, as that was the subcommand use by another extension that this extension was based on. But, now the `diff-index` approach is used instead.

Using `status` is friendly for everyday use as developer. The `diff-index` subcommand is not for everyday use - you can to add a path like `HEAD` and you need to add flags to get sensible output.

Both `status` and `diff-index` can be used to see a list of paths and how they changed, using `from` and `to` as a pair of paths when moving or renaming a file.

Why use `diff-index`? It makes things more **predictable** when parsing output. Since the `from` file is always first, from left to right. While `status` has it on the right, which is hard because it is not always there. There might be other reasons I can't remember.


## Limitation of diff-index

Summary - new files and moved/renamed files _always_ need to be staged for `git diff-index` to see them.

The `diff-index` subcommand cannot see new or moved/renamed files, unless you stage them. Which is okay, because you just need to stage a file and then the extension can see it. 

And in the case of renaming/moving files, there's a limitation of git that can't be overcome - you need to **stage** the old and new paths anyway for `git` to see them as **one file**, regardless of using `status` or `diff-index`.

The `git status` sucommand _can_ handle new _untracked_ files. But the effort to rewrite a chunk of the extension to use a different Git subcommand is not worth it, and won't solve the rename/move case anyway.

So we just keep things simple to avoid bloatin the codebase. You can still do what you need to - just remember to stage files if you need the extension to recognize them.
