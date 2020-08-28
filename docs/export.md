# Export
> Build, use and share a packaged form of the extension file


## Build and install extension locally

This will build the extension `.vsix` archive to the `build` directory using the current code. Then it will install it globally in VS Code.

This is ideal for testing out the changes change in the extension without creating a tag yet.

```sh
$ npm run ext
```

It is best to then **restart** VS Code. You'll see the extension in your Extensions tab.

We use the `--force` flag to downgrade to an older version, according to the CLI output help.

Note: The `ext` command in the [package.json](/package.json) scripts section sorts by _time_ because sorting by name is not reliable when the version is `0.9.0` and `0.10.0` (the latter is meant to be higher but appears as a lower version).
