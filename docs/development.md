# Development
> How to work on this extension locally


## Structure

The code from the Git Prefix was used to set up [src](/src) directory for a couple of TS files and the tests.

The [generate](/src/generate) module followed later as logic that will work standalone in the CLI for a hook.


## Command overview

Quick reference for commands to run in [package.json](/package.json):

- `test` - lint, clean, compile and run tests
- `version` - run tests and then tag and push
- `ext` - build and install extension globally

The other commands define are run indirectly through other commands or the debugger, or only are only run directly infrequently (such as `sb`), so aren't covered here.


## Install

See installation steps in the extension and hook docs - clone the repo and install Node.js and dependencies.


## Run checks

Note these lint and test steps happen in the CI/CD flow - see [main.yml](/.github/workflows/main.yml).

### Run all

This is useful before pushing to ensure everything works. (This could be setup with a pre-push hook too to automated it)

```sh
$ npm run preversion
```

This will run `lint` and `test` steps, with `compile` run as part of `pretest` because of how NPM works.

at once see later in this doc to run steps separately).

### Lint

Run ESLint against TS files for a report. This will not fix any errors though.

```sh
$ npm run lint
```

Note that linting will not actually pick up on TypeScript compilation errors, but that can be done using the compile step. This runs as part of [Tests](#run-tests), so you don't have to run it by hand.

```sh
$ npm run compile
```

### Run tests

For the `git-prefix` project this was partly based on, unfortunately the tests are poor there so I didn't copy over the extension tests, but I could bring back some from tag v0.6.0 so there are integration tests if I think I need them.

#### Unit tests

```sh
$ npm test
```

#### Integration tests

There are no integration tests in this project.

Most of the logic is what happens internally so it is easy to test with unit tests. There is one frontend button and it just pushes a message, so there is not that much that can go wrong in the UI.

What would be more useful is testing the integration with `git` - namely using actual output from `git` commands. For now, the unit tests are created using output copied from git command output, so that is covered. It is possible to add integration tests for this area, but it would end up duplicating the unit tests - unless the integration is just focus on git commands to expected strings which is testing git itself and not the extension.

Notes:

- This extension was built around Git Prefix, but unfortunately the integration tests of Git Prefix extension there are not useful, so I left out integration tests out of my project. I also noticed that downloading of VS Code as an NPM script is different but clear compared with Git Semantic Commit approach. I don't know which is best practice - need to look at some more VS Code samples.
- Git Semantic Commit extension does in-depth integration tests and even creates a separate new repo in a subfolder to run activity in, so I could look at bringing this in to mine.


## Clean

This will clear the unversioned `out` directory - useful to get rid of files after renaming or deleting TS files. This will keep any hidden directories like `.vscode-test` which has a large binary for integration tests.

```sh
$ npm run clean
```

A few problems have been resolved by running the clean command, so this is now part of the `build` step so it runs every time when doing tests or running the extension. Note that the build/compile step happens as part of `watch` too, so it is covered there.


## Run extension in sandbox mode

Start the extension for local development. It will be started in a sandboxed environment with no other extensions active and the extension will not persist when you stop the debugger.

Follow these steps:

1. Open VS Code at this repo if you haven't already.
2. Go to the _Debug_ tab.
3. Run the extension
    - Click _Run Extension_ task.
        - This will start in a default directory such as the home directory.
        - You might want to use File / Open to change the sandbox window to a repo what has more content to play with. This will be remembered on later runs. Unfortunately if you changed your VS Code settings to open in a new window on Open, then the extension setup will be undone.
    - Or click the _Run in Sandbox repo_ task
        - For more reliable and consistent behavior.
        - This will run against `sandbox` directory in the project, which is a git repo where you can make files and commits as you like. You'll need to run `npm run sb` first to ensure this exists and then run the debug action. Run the command again clear the space and start over.
        - Note that the extension currently doesn't work on a repo with zero commits, so you'll have to make a commit and then use the extension.

That will start a new sandboxed VS Code session which has the extension active and all others inactive. At a lower level, it runs `npm compile` and `npm watch`.

The code for the extension is in [src](/src/).

### Reload

The `watch` task is running but I haven't actually seen it make a difference.

So if you make a change to your source code, in the original repo use the green Restart circle in the debugger overlap to reload the extension in the sandbox window.

If you don't see code changes appearing, you may need to stop and start the debugger afresh.


## Install extension globally

### Roll your own

See the [export](export.md) doc to install a dev version of the package.

### Install pre-built extension

Or see [quickstart](quickstart.md) doc to download and install a pre-built version from a GitHub release.


## Resources

See also the [License](/README.md#license) section for links to repos.

NPM packages that parse git status output:

- [git-status](https://www.npmjs.com/package/git-status) - published in 2020. This _has_ to use the git status command so is limiting. It wraps `parse-git-status` - see [index.js](https://github.com/IonicaBizau/git-status/blob/master/lib/index.js).
- [parse-git-status](https://www.npmjs.com/package/parse-git-status) - published in 2016 and no activity since. See [index.js](https://github.com/jamestalmage/parse-git-status/blob/master/index.js) - that is the core logic and a `DESCRIPTIONS` mapping. This package can be used against string output so does not require actually running git status. It doesn't have Types though and also from the tests it doesn't support renaming properly.
    - The output looks like this:
        ```javascript
        parseGitStatus(output)
        {
            x: 'X DESCRIPTION',
            y: 'Y DESCRIPTION',
            to: 'TO PATH',
            from: 'FROM PATH OR NULL'
        }
        ```
