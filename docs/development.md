# Development


## Install

See installation steps in the extension and hook docs - clone the repo and install Node.js and dependencies.



##  Run checks

```sh
$ npm run lint
```

## Run tests


### Unit tests

```sh
$ npm run test:unit
```

Run the pretest and unit test steps together

```sh
$ npm test
```

### Integration stests

Run the VS Code extension tests. VS Code will be downloaded and run against the code in a separate window.

1. Close VS Code - you will get errors unless you **close** VS Code first.
2. Run integration tests.
    ```sh
    $ npm run pretest && npm run test:ig
    ```


## Clean

This will clear the unversioned `out` directory - useful to get rid of files after renaming or deleting TS files. This will keep any hidden directories like `.vscode-test` which has a large binary for integration tests.

```sh
$ npm run clean
```


## Tag

```sh
$ npm version minor
```
