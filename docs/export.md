# Export
> Build, use and share a packaged form of the extension file


## Build and install extension locally

This is ideal for testing out local changes in you've made extension, without creating a tag.

```sh
$ npm run ext
```

That will do the following:

1. Build the extension `.vsix` archive to the `build` directory using the current code. Performing all necessary checks.
2. It will install the extension globally in VS Code.

You should then **restart** VS Code.

You can find the extension in the Extension tab.


### Notes

- Within the `ext` command, we use the `--force` flag to downgrade to an older version, according to the CLI output help.
- The `ext` command in the [package.json](/package.json) scripts section sorts by _time_ because sorting by name is not reliable when the version is `0.9.0` and `0.10.0` (the latter is meant to be higher but appears as a lower version).
