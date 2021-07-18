# Changes

Describe how files changed.


## Git

See `DESCRIPTION` enum in the [constants.ts][] module. This is a description of _how_ a file changed - it will sometimes be used in generated description as the [Conventional Commits][] doc.

This enum is a mapping of single characters keys and the verb, such as `M` for `modified`.

When running either subcommand, you might get the short or long form of a change.

The enum's _keys_ are from status when using the status `--short` output or standard `diff-index` output.

e.g.

```console
$ git status --short
 M abc.txt
 A def.txt
$ g diff-index --name-status HEAD
M       abc.txt
A       def.txt
```

The enum's _values_ are the human-readable values from the status long output (standard with no flag). The `diff-index` command has no long output for these verbs, as far as I can tell.

e.g.

```console
$ git status
...
    modified:   abc.txt
    new file:   def.txt
```

### Origin

For more info, see the Git docs for either `git status` or `git diff-index`.

From [git-diff-index][]:

> Possible status letters are:
>
> - A: addition of a file
> - C: copy of a file into a new one
> - D: deletion of a file
> - M: modification of the contents or mode of a file
> - R: renaming of a file
> - T: change in the type of the file
> - U: file is unmerged (you must complete the merge before it can be committed)
> - X: "unknown" change type (most probably a bug, please report it)

Note this extension does not care about the last 3 kinds.


### Create note

For the `A` key of the enum, `create` was used as more natural form than `add` or `addition`.

### Copy note

The 'copied' case is very _rare_. I've noted here how it works.

I've only come across it once using this extension and it was like this:

- One file `abc.txt` was updated (empty content replaced with text).
- Another file `def.txt` was created (empty content).

Both were staged and a message generated. And then `diff-index` appears like to see `def.txt` as a copy of what `abc.txt` _was_ before it was modified.

Result:

```json
["M abc.txt", "C100 abc.txt def.txt"]
```


## Actions

See `ACTION` in the [constants.ts][] module.

These are based on Git syntax as in the `DESCRIPTION`. Except that values are in the _active_
voice rather than the past tense, in order fit the Conventional Commit style. Plus, 'update' is
used as a more natural word than 'modify'.

Note that 'move' will be included in the 'rename' case and this project detects move versus rename with other longer.


[constants.ts]: /src/lib/constants.ts
[Conventional Commits]: /docs/manual/conventional-commits.md
[git-diff-index]: https://git-scm.com/docs/git-diff-index
