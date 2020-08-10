# Development


## Structure

The code from the Semantic Git Commit extension was used to set up [src](/src) directory for a couple of TS files and the tests. 

The [generate](/src/generate) module followed later as logic that will work standalone in the CLI for a hook.


## Install

See installation steps in the extension and hook docs - clone the repo and install Node.js and dependencies.


## Run extension in sandbox mode


## Usage
> Start the extension for local development

Open VS Code at the repo.

```sh
$ code .
```

Run the extension.

1. Go to the Debub tab.
2. Click _Run Extension_.


This will start a sandboxed VS Code window which has the extension active in it and no other extensions. At a lower level, it runs `npm compile` and `npm watch`.

You might want to use File / Open to change the sandbox window to a repo what has more content to play around it. This will be remembered on later runs.

If you make a change to your source code, use the green Restart circle in the debugger overlap to reload the extension in the sandbox windo.w.

The code for the extension is in [src](/src/).


##  Run checks

```sh
$ npm run lint
```

## Run tests

For the git-prefix project this was partly based on, unfortunately the tests are poor there so I didn't copy over the extension tests, but I could bring back some from tag v0.6.0 so there are integration tests if I think I need them.

### Unit tests

```sh
$ npm run test:unit
```

Run the pretest and unit test steps together

```sh
$ npm test
```


## Clean

This will clear the unversioned `out` directory - useful to get rid of files after renaming or deleting TS files. This will keep any hidden directories like `.vscode-test` which has a large binary for integration tests.

```sh
$ npm run clean
```

A few problems have been resolved by running the clean command, so this is now part of the `build` step so it runs every time when doing tests or running the extension. Note that the build/compile step happens as part of `watch` too, so it is covered there.


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
