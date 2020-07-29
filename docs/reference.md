# Reference


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
