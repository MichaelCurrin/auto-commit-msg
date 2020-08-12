# Development


## Structure

The code from the Git Prefix was used to set up [src](/src) directory for a couple of TS files and the tests. 

The [generate](/src/generate) module followed later as logic that will work standalone in the CLI for a hook.


## Install

See installation steps in the extension and hook docs - clone the repo and install Node.js and dependencies.


## Run checks

### Lint

Run ESLint against TS files for a report. This will not fix any errors though.

```sh
$ npm run lint
```

Note this also runs in the CI/CD pipeline.


## Run tests

For the git-prefix project this was partly based on, unfortunately the tests are poor there so I didn't copy over the extension tests, but I could bring back some from tag v0.6.0 so there are integration tests if I think I need them.

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
> Start the extension for local development

There is an easy flow to build and use the extension without having to install it globally.

Open VS Code at the repo.

```sh
$ code .
```

Run the extension.

1. Go to the Debub tab.
2. Click _Run Extension_.


This will start a new sandboxed VS Code window which has the extension active in it and no other extensions active. At a lower level, it runs `npm compile` and `npm watch`.

You might want to use File / Open to change the sandbox window to a repo what has more content to play around it. This will be remembered on later runs.

If you make a change to your source code, use the green Restart circle in the debugger overlap to reload the extension in the sandbox windo.w.

The code for the extension is in [src](/src/).


## Releases

```sh
$ npm version minor
```

```sh
$ git push --follow-tags
```

Then I go into the releases on GH section and add a title.


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
