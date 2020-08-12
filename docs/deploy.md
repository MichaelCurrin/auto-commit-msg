# Deploy
> Build, use and share a packaged form of the extension file

See [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) in the docs.

This section uses the [vsce](https://github.com/microsoft/vscode-vsce) package from NPM.

> vsce, short for "Visual Studio Code Extensions", is a command-line tool for packaging, publishing and managing VS Code extensions.

That is used to create a `.vsix` archive file. This can be used locally (unzipped and place in `.~/vscode/extensions` for user and may repo level), sent to others (directly or through a download on GitHub), or published to the VS Code marketplace (not currently setup for this extension).


## Build and setup extension locally

This will build the extension to the `build` directory and then install it globally in VS Code.

```sh
$ npm run ext
```

You may need to restart VS Code. You'll see the extension in your Extensions tab.

Sample output for reference:

```
> auto-commit-msg@0.7.0 ext /home/michael/repos/auto-commit-msg
> npm run build && code --install-extension $(find build/* | sort -r | head -n1)


> auto-commit-msg@0.7.0 build /home/michael/repos/auto-commit-msg
> vsce package --out build/

Executing prepublish script 'npm run vscode:prepublish'...

> auto-commit-msg@0.7.0 vscode:prepublish /home/michael/repos/auto-commit-msg
> npm run compile


> auto-commit-msg@0.7.0 compile /home/michael/repos/auto-commit-msg
> npm run clean && tsc -p ./


> auto-commit-msg@0.7.0 clean /home/michael/repos/auto-commit-msg
> rm -rf ./out/*

 DONE  Packaged: build/auto-commit-msg-0.7.0.vsix (29 files, 34.9KB)
 INFO  
The latest version of vsce is 1.78.0 and you have 1.77.0.
Update it now: npm install -g vsce
Installing extensions...
Extension 'auto-commit-msg-0.7.0.vsix' was successfully installed.
```
