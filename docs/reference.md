# Reference

See my [git hooks](https://github.com/MichaelCurrin/dev-cheatsheets/blob/master/cheatsheets/git/hooks.md) reference.


## Prepare commit message

In `prepare-commit-msg` hook, assuming it is a Bash script.

You can use echo/print lines to print out - this would be printed
on a successful or failed git commit.
If you want to actually write over the message you need to use the path to the commit message temp file.

e.g.

```sh
COMMIT_MSG_FILE=$1
echo -n "$CHG" >$COMMIT_MSG_FILE
```

Note writing of multi-line output to the file is needed like above.

The file path will be like:

```
$HOME/path/to/repo/.git/COMMIT_EDITMSG
```

## git status

This will ignore untracked files and have machine-readable output (without color).

```sh
CHG=$(git status -s -uno --porcelain)
```

```
-s --short

-u[<mode>], --untracked-files[=<mode>]
    Show untracked files.
    ...
        The possible options are:
    •   no - Show no untracked files.
    •   normal - Shows untracked files and directories.
    •   all - Also shows individual files in untracked directories.

--porcelain
  Give the output in an easy-to-parse format for scripts. This is similar to the short
  output, but will remain stable across Git versions and regardless of user
  configuration.
```

## git diff

Copied from sample hook:

```sh
git diff --cached --name-status -r
```

Breaking that down:

```
--staged is a synonym of --cached

--name-status
    Show only names and status of changed files. See the description of the --diff-filter
    option on what the status letters mean.

--diff-filter=[(A|C|D|M|R|T|U|X|B)...[*]]
    Select only files that are Added (A), Copied (C), Deleted (D), Modified (M), Renamed
    (R), have their type (i.e. regular file, symlink, submodule, ...) changed (T), are
    Unmerged (U), are Unknown (X), or have had their pairing Broken (B). Any combination
    of the filter characters (including none) can be used. When * (All-or-none) is added
    to the combination, all paths are selected if there is any file that matches other
    criteria in the comparison; if there is no file that matches other criteria, nothing
    is selected.
```
