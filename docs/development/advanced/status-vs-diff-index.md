# status vs diff-index

The [parseOutput.ts](/src/git/parseOutput.ts) handles output of two similar git commands.

The well-known `status` command.

```sh
$ git status [FLAGS] --short
```

And the lesser-known `diff-index` command.

```sh
$ git diff-index [FLAGS] HEAD
```

This project was initially built around `status`, using another extension to design around. But now the `diff-index` approach is used instead.

Using `diff-index` makes things more predictable as the `from` file is always first from left to right, while status has it on the right, which is hard because it is not always there. There might be other reasons I can't remember.

A disadvantage though is that while `status` can handle new untracked files, `diff-index` can't see them. Which is okay, because when renaming a file, you need to **stage** the old and new paths for `git` to see them as **one file**. Regardless of using `status` or `diff-index`.

i.e. New files and renamed files _always_ need staging for `git diff-index` to see them.
