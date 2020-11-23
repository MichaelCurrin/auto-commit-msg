# Commands
> Guide for using NPM commands in this project


## Overview of commands

There are just a few important `npm` commands to know for this project. These are covered in the [Makefile](/Makefile) and can be run with `make TARGET` for convenience.

The other NPM script commands are run indirectly through the other commands or through the debugger. Or are only run directly infrequently, so they aren't covered here.

See [package.json](/package.json) for all commands.


## Install

See installation steps in the extension and hook docs - clone the repo and install Node.js and dependencies.


## Run checks

Note these lint and test steps happen in the CI/CD flow - see [main.yml](/.github/workflows/main.yml).

### Run all

This is useful before pushing to ensure everything works. (This could be setup with a pre-push hook too to automated it)

```sh
$ npm run preversion
```

This is setup to run the linting and test steps, with `compile` run as part of `pretest` because of how NPM works.

See later in this doc to run steps separately.

### Lint

Run ESLint against TS files for a report and fixing problems where possible.

```sh
$ npm run lint:fix
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
