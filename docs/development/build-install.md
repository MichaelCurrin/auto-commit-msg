# Build and install

Build the extension using Node and then install it in your IDE, using the latest code in the repo. This is ideal for testing out local changes you've made in the extension, without creating a tag yet.

Navigate to the repo root and then run this:

```sh
$ make ext
```

That will do the following:

1. Run **lint** checks.
1. **Build** the extension using the current codebase and output as an `.vsix` archive file to the `build` directory. Performs all necessary code quality checks.
1. **Install** the extension globally in VS Code.

You should then **restart** VS Code.

You can find the extension in the _Extension_ tab.

## Issues installing using WSL

If using WSL, then after the build is complete you might get an error:

```
ERROR: UtilConnectToInteropServer
```

In that case, you'll need to install from the `.vsix` file yourself:

1. Open the VS Code _Command Palette_ under _View_.
1. Select the option _Extension: Install from VSIX..._.
1. Enter the path to the file e.g. `/home/my-user/repos/auto-commit-msg/build/auto-commit-msg-0.25.1.vsix`.

## Notes

About the `ext` command in [package.json](/package.json):

- We use the `--force` flag to allow **downgrade** to an older version, according to the CLI output help.
- The command sorts by _time_ to find the latest version. Since sorting by name is _not_ reliable, such as when the version is `0.9.0` and `0.10.0` and the latter is meant to be higher but appears like a lower version)
