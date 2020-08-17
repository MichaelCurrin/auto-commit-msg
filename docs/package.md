# Package
> Build, use and share a packaged form of the extension file

See [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) in the docs.

This section uses the [vsce](https://github.com/microsoft/vscode-vsce) package from NPM.

> vsce, short for "Visual Studio Code Extensions", is a command-line tool for packaging, publishing and managing VS Code extensions.

That is used to create a `.vsix` archive file. This can be used locally (unzipped and place in `.~/vscode/extensions` for user and may repo level), sent to others (directly or through a download on GitHub), or published to the VS Code marketplace (not currently setup for this extension).


## Build and setup extension locally

This will build the extension to the `build` directory, then install it globally in VS Code. This is ideal for testing out the changes change in the extension without creating a tag yet.

```sh
$ npm run ext
```

It is best to then **restart** VS Code. You'll see the extension in your Extensions tab.

We use the `--force` flag to downgrade to an older version, according to the CLI output help.
