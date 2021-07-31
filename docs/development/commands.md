# Commands
> Guide for running tasks in this project


## Overview

There are just a _few_ important or frequent `npm` commands to know for this project. To make those easier to access and remember, some shortcut commands have been set up.

This has been done with `make` as a task runner than wraps `npm run`. These tasks are covered in the [Makefile](/Makefile). They can be run with `make TARGET` for convenience. This is standard on macOS and Linux but you will need to install `make` on Windows.

See [package.json](/package.json) for all the underlying NPM commands. Note that `.` is better than `src`, as then the configs like `tsconfig.json` can be found - otherwise you'll get an error.


See also the [NPM tasks](advanced/npm-tasks.md) doc.


## Run tasks

Run major tasks to check the project for issues.

```sh
$ make all
```

This will up hooks, install packages, fix, and unit test tasks.

This is useful for bootstrapping the project on a fresh clone, or before pushing commits. This task also runs as part of the `pre-push` hook after that has been set up.


## Run checks

Note these lint and test steps happen in the CI/CD flow - see [Deploy](deploy.md).

### Format

Apply Prettier formatting to scripts.

```sh
$ make fmt
```

### Lint

Run ESLint against TS files for a report and fixing problems where possible.

```sh
$ make lint
```

Note that linting will not pick up on TypeScript compilation errors, but that can be done using the `npm run compile` step. This runs as part of [Run tests](#run-tests) section.

### Run tests

See the [Tests](tests.md) doc for more.

Skip clean and style steps, for even faster results such and when editing test spec files. At the risk of inconsistencies sometimes, if a file is renamed or moved.

```sh
$ make test-quick
```

### Run all checks

Clean output, format code, and then run unit tests including code coverage.

```sh
$ make test
```
