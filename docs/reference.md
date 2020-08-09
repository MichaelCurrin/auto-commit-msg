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

See more in my dev cheatsheets.


### Warning

Note a weakness - if you rename a file and then modify it, then you can have A and M for one file.

```sh
$ git status -s
D  src/test/main.test.ts
AM src/test/single-file.test.ts
```

But when adding first using CLI or UI, then it will be simplified. 

If the percent change is very small, then it will be converted to a rename.

In this case the files are different enough to not be collapsed as a rename. Note that no code was changed - the add command changes from above.

```sh
$ git add -A
$ git status -s
D  src/test/main.test.ts
A  src/test/single-file.test.ts
```

Fortunately, this status will always run _after_ staging because of the hook flow (or extension use).
