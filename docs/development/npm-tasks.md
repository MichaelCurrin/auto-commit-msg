# NPM tasks


## Clean

This will clear the unversioned `out` directory - useful to get rid of files after renaming or deleting TS files. This will keep any hidden directories like `.vscode-test` which has a large binary for integration tests.

```sh
$ npm run clean
```

A few problems have been resolved by running the clean command, so this is now part of the `build` step so it runs every time when doing tests or running the extension. Note that the build/compile step happens as part of `watch` too, so it is covered there.
