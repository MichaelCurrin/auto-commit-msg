# Quickstart
> How to get the pre-built extension installed in VS Code


## Setup and run the extension

This is extension is not available in the VS Code marketplace, but you can still try it out. 

Below is a short quick guide to get the extension installed globally in your VS Code. Note that you do not need to install any dependencies or download this project. You only need VS Code installed.

### Install

1. Download a copy of the `.vsix` asset on the latest release - [Releases](https://github.com/MichaelCurrin/auto-commit-msg/releases). This is an archive file but you don't need to unzip it.
2. Run the following command with the path to the downloaded file.
    ```sh
    $ code --install-extension PATH
    ```

This can be done with VS Code still running but it is best to restart VS Code when making updates to this extension. 

If you already have the extension installed, this will overwrite it.

### Run

1. Open VS Code
1. Go to the Source Control (Git Extension) tab. You'll see the extension added.
1. Stage a file change in your repo.
1. Click the extension button to push a message to the message box.
1. Commit with the VS Code UI. e.g. Use <kbd>CTRL</kbd>+<kbd>ENTER</kbd> or press the tick button.

To avoid clicking the extension with the mouse, you can use the command bar.

1. Press <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>P</kbd> to open it up, select _Auto Commit Message_ and press enter or click it.
1. Your cursor will move to the commit message box, so now you can press commit with the keyboard. Use <kbd>CTRL</kbd>+<kbd>ENTER</kbd>.


### Remove 

Uninstall the extension if you don't want it anymore.

- Go to the Extensions tab, find it and click uninstall.
- Or run this command then restart VS Code.
    ```sh
    $ code --uninstall-extension MichaelCurrin.auto-commit-msg
    ```
