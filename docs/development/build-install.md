# Build and install

Build the extension using Node and then install it in your IDE, using the latest code in the repo.

This is ideal for testing out local changes you've made in the extension, without creating a tag yet.

Navigate to the repo root and then run this:

```sh
$ make ext
```

That will do the following:

1. Run **lint** checks.
2. **Build** the extension `.vsix` archive to the `build` directory using the current code. Performing all necessary checks.
3. It will **install** the extension globally in VS Code.

You should then **restart** VS Code.

You can find the extension in the _Extension_ tab.

### Notes

About the `ext` command in [package.json](/package.json).

- We use the `--force` flag to allow **downgrade** to an older version, according to the CLI output help.
- The command sorts by _time_ to find the latest version. Since sorting by name is _not_ reliable, such as when the version is `0.9.0` and `0.10.0` and the latter is meant to be higher but appears like a lower version)
