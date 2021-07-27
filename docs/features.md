# Features

## What it does

- Click the button in the Git pane to run the extension.
- Reads from the status of your git repo, or staged changes
- Generates a commit message for you, then you can edit and commit as you like
- Installable from archive file (see _assets_ list under latest [release](https://github.com/MichaelCurrin/auto-commit-msg/releases)) - not yet available in the extension marketplace.


## Details

A roadmap of features and whether done or not.

- [x] Handle staged and unstaged files flexibly.
    - Handle **staged** files if there are any, so you can change a few files and then generate messages for those. But if there are zero staged changes, the extension will fall back to the working tree of unstaged changes.
    - Note that **new** files (including when doing a rename) should **always** be staged so that the extension can pick them up and so git can see that two paths for a renamed file are the same file.
- [x] Generate a single-line commit message for a file to be committed, using action verbs (e.g. `Create`, `Update`, `Delete`)
- [x] Handle changes from a single changed file
- [ ] Handle changes from two or more files.
    - [x] As a list of the same nature e.g. `update foo.txt and fizz/bar.txt`, `feat: create foo.txt, fizz/bar.txt and buzz.js` (including prefix) and `Various changes to foo.txt and fizz/bar.txt` (for one updated and one new file). See [#29](https://github.com/MichaelCurrin/auto-commit-msg/pull/29).
    - [x] As a count. e.g. `update 3 files`. See [#38](https://github.com/MichaelCurrin/auto-commit-msg/issues/38).
    - [ ] As different verb for each change `create foo.txt and delete bar.txt`. See [#37](https://github.com/MichaelCurrin/auto-commit-msg/issues/37) and See [#52](https://github.com/MichaelCurrin/auto-commit-msg/issues/52).
    - [ ] As a count in a directory. `update 3 files in bar`
    - [ ] As a count with a conventional commit message. See [#51](https://github.com/MichaelCurrin/auto-commit-msg/issues/51).
    - [ ] As a count with a label. e.g. `update 3 config files`. See [#13](https://github.com/MichaelCurrin/auto-commit-msg/issues/13).
    - [ ] As count that uses the old message. See [#55](https://github.com/MichaelCurrin/auto-commit-msg/issues/55)
- [x] Keep user-entered value as a prefix e.g. Keep `docs:` (or ticket number) so message becomes `docs: Update README.md`
- [x] Use conventional commits e.g. `chore: Update package.json`


## Topics areas

It recognizes files from a variety of languages and tooling and then provides an appropriate conventional commit message.

- [x] Python - package files and configs.
- [x] JavaScript, TypeScript  - package files and configs.
- [x] Ruby - package files and configs.
- [x] Go modules.
- [x] Circle CI, GitHub Actions - `ci`.
- [x] Makefile and package files for languages - `build`.
- [x] Config files like YAML, JSON and TOML - `chore` or `build`.

### Capabilities

This extension understands something about a single file and how it changed.

#### Actions

Here are supported action words that are used.

- `Create`
- `Update`
- `Delete`
- `Move`
- `Rename`
- `Move and rename`

#### Prefixes

Based on the action and the file (directory, name, and extension), a _conventional commit_ prefix will be derived. If none of the labels can be applied, they be will left out.

Here are the prefixes it knows, with a summary of the rule used.

| Prefix  | Rule                                                                                                                                                               |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `feat`  | For a new file. (The tool can't differentiate between content for a feature / refactor / bug fix, but it assumes a new file is probably going to be a new feature) |
| `chore` | For config files and for deleting, renaming, or moving a file.                                                                                                     |
| `build` | For package management files and `Makefile` / `Rakefile`.                                                                                                          |
| `ci`    | For configs around GH Actions, CircleCI and BuildKite.                                                                                                             |
| `test`  | For directories and files related to tests, like `tests/` or `index.spec.js`.                                                                                      |
| `docs`  | For documentation changes, like `README.md`, `docs/` or `CONTRIBUTING.md`.                                                                                         |

There are other prefixes available. These require looking at the content of the file, not just the path. These are not in the scope of this project, but you can always type them manually.

- `style`
- `fix`
- `refactor`
- `perf`
