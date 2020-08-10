# Publish
> Build, use and share a packaged form of the extension file

See [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) in the docs.

This seciton uses the [vsce](https://github.com/microsoft/vscode-vsce) package from NPM.

> vsce, short for "Visual Studio Code Extensions", is a command-line tool for packaging, publishing and managing VS Code extensions.

That is used to create a `.vsix` binary file.which can be used locally (in `.vscode/extensions` for user or repo level), sent to others (directly or through a download on GitHub), or published to the VS Code marketplace (not currently setup for this extension).


<!-- TODO: Move sections to cheatsheets -->

## CLI

```sh
$ vsce --help
```
```
Usage: vsce <command> [options]

Options:
  -V, --version                        output the version number
  -h, --help                           output usage information

Commands:
  ls [options]                         Lists all the files that will be published
  package [options]                    Packages an extension
  publish [options] [<version>]        Publishes an extension
  unpublish [options] [<extensionid>]  Unpublishes an extension. Example extension id: microsoft.csharp.
  ls-publishers                        List all known publishers
  create-publisher <publisher>         Creates a new publisher
  delete-publisher <publisher>         Deletes a publisher
  login <publisher>                    Add a publisher to the known publishers list
  logout <publisher>                   Remove a publisher from the known publishers list
  show [options] <extensionid>         Show extension metadata
  search [options] <text>              search extension gallery
```

## Commands

Run `vsce` using a global installed, or use `node_modules/bin/vsce` instead of `vsce` below. Run from the project root.

### List

```sh
$ vsce ls
```

### Package

The package and publish steps could be added to `package.json` and also then to a workflow for a release. For now, manually using and also uploading to a release will work.


```sh
$ vsce package
Executing prepublish script 'npm run vscode:prepublish'...
...
DONE  Packaged: /home/michael/repos/auto-commit-msg/auto-commit-msg-0.6.0.vsix (31 files, 33.21KB)
```

Alternatively:

```sh
$ vsce package --out build
```

Example output name: `auto-commit-msg-0.6.0.vsix`. That will be in the repo root or a given out directory.


```sh
$ vsce package -h
```
```
Usage: package [options]

Packages an extension

Options:
  -o, --out [path]        Output .vsix extension file to [path] location
  --baseContentUrl [url]  Prepend all relative links in README.md with this url.
  --baseImagesUrl [url]   Prepend all relative image links in README.md with this url.
  --yarn                  Use yarn instead of npm
  --ignoreFile [path]     Indicate alternative .vscodeignore
  --noGitHubIssueLinking  Prevent automatic expansion of GitHub-style issue syntax into links
  -h, --help              output usage information
```

### Publish

Some other steps might be needed like `login` and `create-publisher`.

```sh
$ vsce publish
# <publisherID>.myExtension published to VS Code MarketPlace
```

## Install

Extensions must go `~/.vscode/extensions` according to the docs - that's where other marketplace extensions go as directories.

Run this to unzip your build package and move it to the appropriate directory.

```sh
$ code --install-extension EXTENSION_PATH
```
```
Installing extensions...
Extension 'auto-commit-msg-0.6.0.vsix' was successfully installed.
```

Check it:

```sh
$ ls ~/.vscode/extensions/
```
```
dbaeumer.vscode-eslint-2.1.8      michaelcurrin.auto-commit-msg-0.6.0
```


If published, you can also install by providing the extension ID from the marketplace.

There is also the `ext` syntax you'll see in the marketplace which can be added to the command bar.

## Notes

The [.vscodeignore](/.vscodeignore) file determines what gets excluded from the package. The `.vsix` file seems implied and not needed to be listed there. Same for `package-lock.json` and `.vscode` directory. 

But other dot paths like `.github` and `.gitignore` must be listed in the ignore file. You might want to keep the `docs` and `LICENSE` though.

The `vscode:prepublish` step is set in [package.json](/package.json). This is run as part of `vsce`.
