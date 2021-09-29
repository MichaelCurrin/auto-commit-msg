# Credit
> Giving credit to projects which influenced this project


The core of this project's VS Code extension logic is about creating a commit message and pushing it to the _Git Extension_ input box in the UI. That comes from the _Git Prefix_ extension. The use of _Git CLI_ in the extension comes from the _Semantic Git Commit_ extension.

See more info below.


## Hello World sample

- Source: [Hello World test sample](https://github.com/microsoft/vscode-extension-samples/tree/master/helloworld-test-sample) project
- My project started off as an extension based on this VS Code test sample. It was just hello world and didn't help with my flow, so I got rid of the code in later tags.


## Git Semantic Commit

Note that a "semantic commit" message is the same as a "conventional commit" message.

- Repo: [nitayneeman/vscode-git-semantic-commit](https://github.com/nitayneeman/vscode-git-semantic-commit)
- I liked how this extension does Git CLI commands, so I used the original [Git](https://github.com/nitayneeman/vscode-git-semantic-commit/blob/master/src/git.ts) class and `getWorkspaceFolder` function. That served as the base for my functionality in [gitCommands.ts](/src/gitCommands.ts), which allowed my `extension.ts` script to work as I wanted. I later split out the `Git` class into functions as that made more sense.
- The rest of the extension was too advanced for what I needed to do, so I ended up not using the other parts.
- I like the integration tests approach though so I might come back to use pieces of that.


## Git Prefix

- Repos: [srmeyers/git-prefix](https://github.com/srmeyers/git-prefix) or the fork [d3skdev/git-prefix](https://github.com/d3skdev/git-prefix).
- I found this in the marketplace - it adds a _branch prefix_ to the commit message UI box and gives the user a chance to read it and edit it. This is very close to the flow that I want and it is far less code than Git Semantic Commit, so my extension is based on this. See for example the use of `repository.inputBox.value` in [extension.ts](/src/extension.ts).


## Parse Git Status

- Repo: [jamestalmage/parse-git-status](https://github.com/jamestalmage/parse-git-status)
- I started out parsing git status output (not diff-index), intending to use this NPM package. Unfortunately, it does not come with types and I couldn't figure out how to add types, so I took the logic from it and rewrote it as my own so it is easier to manage and extend. See my [parse-git-output](/src/generate/parse-git-output) module - that based on `parse-git-status`.
- My enhancements:
    - Compatible with git status `--porcelain` flag.
        - Replaced use of `-z` mode. As I do not like separating by either one _or_ two null characters and how the original package did this splitting. So I split columns by whitespace rather and had lines split by a newline character (for when more than one files changes or there is a trailing line).
    - Cleaner `for` loop logic
        - I found the original hard to work on because of how it uses an old-style `for` loop and `i` variable.
        - I found using `.split` with a regex pattern was much simpler.
    - Add TS types (essential for my project to run).
    - Add `git diff-index` support - see [status vs diff-index](/docs/development/status-vs-diff-index.md) doc.
