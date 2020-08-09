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


## Dependencies

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
