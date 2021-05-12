# Features

What this VS Code extension can do:

- [x] Installable from archive file (see _assets_ list under latest [release](https://github.com/MichaelCurrin/auto-commit-msg/releases))
- [x] Handle staged and unstaged files flexibly.
    - Handle **staged** files if there are any, so you can change a few files and then generate message for those. But if there are zero staged changes, the extension will fallback to the working tree of unstaged changes.
    - Note that **new** files (including when doing a rename) should **always** be staged so that the extension can pick them up and so git can see that two paths for a renamed file are the same file.
- [x] Generate a single-line commit message for file to be committed, using action verbs (e.g. `Create`, `Update`, `Delete`)
- [x] Handle changes from a single changed file
- [ ] Handle changes from two or more files.
    - [x] As a list of the same nature e.g. `Update foo.txt and fizz/bar.txt`, `feat: Create foo.txt, fizz/bar.txt and buzz.js` (including prefix) and `Various changes to foo.txt and fizz/bar.txt` (for say one updated and one new file). See [#29](https://github.com/MichaelCurrin/auto-commit-msg/pull/29).
    - [ ] As as different verb for each change `Create foo.txt and delete bar.txt`. See [#37](https://github.com/MichaelCurrin/auto-commit-msg/issues/37).
    - [ ] As a count. e.g. `Update 3 files in foo`. See [#18](https://github.com/MichaelCurrin/auto-commit-msg/issues/38).
    - [ ] As a count with label. e.g. `Update 3 configs`. See [#13](https://github.com/MichaelCurrin/auto-commit-msg/issues/13).
- [x] Keep user-entered value as a prefix e.g. Keep `docs:` (or ticket number) so message becomes `docs: Update README.md`
- [x] Use conventional commits e.g. `chore: Update package.json`


## Topics areas

If recognizes files for a variety of languages and tooling, for providing an appropriate conventional commit message.

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

Here are supported action words which will be used.

- `Create`
- `Update`
- `Delete`
- `Move`
- `Rename`
- `Move and rename`

#### Prefixes

Based on the action and the file (directory, name and extension), a _conventional commit_ prefix will be derived. If none of the labels can be applied, it will left out.

Here are the prefixes it knows and a summary of the rule used.

| Prefix  | Rule                                                                                                                                                             |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `feat`  | For a new file. (The tool can't differentiate between content for a feature / refactor / bug fix, but it assumes a new file is probably going to be new feature) |
| `chore` | For config files and for deleting, renaming or moving a file.                                                                                                    |
| `build` | For package management files and `Makefile` / `Rakefile`.                                                                                                        |
| `ci`    | For configs around GH Actions, CircleCI and BuildKite.                                                                                                           |
| `test`  | For directories and files related to tests, like `tests/` or `index.spec.js`.                                                                                    |
| `docs`  | For documentation changes, like `README.md`, `docs/` or `CONTRIBUTING.md`.                                                                                       |

There are other prefixes available. These require looking at the content of the file, not just the path. These are not in the scope of this project, but you can always type them manually.

- `style`
- `fix`
- `refactor`
- `perf`
