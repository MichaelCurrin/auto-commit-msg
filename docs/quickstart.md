# Quickstart
> How to get the pre-built extension installed in VS Code

_This extension is not yet available through the VS Code extension marketplace._

This guides covers how to get the extension installed globally in your VS Code using a downloaded file and then start using the extension

## Requirements

You only need to have VS Code installed and access to run terminal commands.

You do **not** need to download the repo or have NPM / Node installed.


## Install
> Use the terminal to install the extension from pre-built file

This is extension is **not available** in the VS Code marketplace yet, but you download it from GitHub.

1. Go to the GitHub Releases page.
    - [![view - releases](https://img.shields.io/badge/view-releases-2ea44f?style=for-the-badge&logo=github)](https://github.com/MichaelCurrin/auto-commit-msg/releases)
1. Find the latest release and expand the _Assets_ section.
1. Download a copy of the `.vsix` archive file.
    - Click on the filename. OR
    - Use the shell to download.
        e.g.
        ```sh
        $ cd ~/Downloads
        $ curl -O https://github.com/MichaelCurrin/auto-commit-msg/releases/download/v0.17.0/auto-commit-msg-0.17.0.vsix
        ```
1. Install the extension. Here we run VS Code in the CLI against path to the downloaded file (no need to unzip it first).
    ```sh
    $ code --install-extension PATH
    ```
    e.g.
    ```sh
    $ code --install-extension ~/Downloads/auto-commit-msg-0.18.0.vsix
    ```
    ```
    Installing extensions...
    Extension 'auto-commit-msg-0.18.0.vsix' was successfully installed.
    ```

If you have VS Code running already, make sure to **restart** it to get the extension loaded.


## Run
> How to use extension after it has been installed

1. Open VS Code.
1. Go to the Source Control (Git Extension) tab. You'll see this extension added.
1. Make a change to a file and use the Soure Control pane to stage a file.
1. Click the extension button.
1. You'll see a message added the commit message box. Edit it if you want.
1. Commit with the VS Code UI. e.g. Use <kbd>CTRL</kbd>+<kbd>ENTER</kbd> or press the tick button.

To avoid having to use the extension with the mouse, you can use the command bar:

1. Press <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>P</kbd> to open it up, select _Auto Commit Message_ and press enter or click it.
1. Your cursor will move to the commit message box, so now you can press commit with the keyboard. Use <kbd>CTRL</kbd>+<kbd>ENTER</kbd>.


## Remove
> How to uninstall the extension if you don't want it anymore

1. Go to the _Extensions_ tab.
2. Click the extension.
3. Click _uninstall_.

Or

1. Run this command.
    ```sh
    $ code --uninstall-extension MichaelCurrin.auto-commit-msg
    ```
2. Restart VS Code.
