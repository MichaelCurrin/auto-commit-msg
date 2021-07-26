# Export
> Build, use and share a packaged form of the extension file


## Build and install extension locally

This is ideal for testing out local changes in you've made extension, without creating a tag.

```sh
$ make ext
```

That will do the following:

1. Run **lint** checks.
1. **Build** the extension `.vsix` archive to the `build` directory using the current code. Performing all necessary checks.
1. It will **install** the extension globally in VS Code.

You should then **restart** VS Code.

You can find the extension in the _Extension_ tab.

### Notes

About the `ext` command in [package.json](/package.json).

- We use the `--force` flag to allow **downgrade** to an older version, according to the CLI output help.
- The command sorts by _time_ to find the latest version. As sorting by name is _not_ reliable, such as when the version is `0.9.0` and `0.10.0` and the latter is meant to be higher but appears as a lower version)
