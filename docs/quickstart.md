# Quickstart
> How to get the pre-built extension installed in VS Code


## Setup and run the extension

Here is a short quick guide to get the extension installed globally in your VS Code using a downloaded file and then start using the extension.

You only need to have VS Code installed. You do not need to install any dependencies yourself or download this repo. 


### Install
> Use the terminal to install the extension from pre-built file

This is extension is **not available** in the VS Code marketplace yet, but you download it from GitHub.

1. Download a copy of the `.vsix` asset on the latest release - see [Releases](https://github.com/MichaelCurrin/auto-commit-msg/releases).
2. Run the following using the downloaded file's path.
    ```sh
    $ code --install-extension PATH
    ```
    e.g.
    ```sh
    $ code --install-extension ~/Downloads/auto-commit-msg-0.13.0.vsix
    ```
    ```
    Installing extensions...
    Extension 'auto-commit-msg-0.13.0.vsix' was successfully installed.
    ```

You can proceed to use the extension using the next section.

### Run
> How to use extension after it has been installed

1. Open VS Code (or restart VS Code if you just installed or updated the extension).
1. Go to the Source Control (Git Extension) tab. You'll see the extension added.
1. Stage a file change in your repo.
1. Click the extension button to push a message to the message box.
1. Commit with the VS Code UI. e.g. Use <kbd>CTRL</kbd>+<kbd>ENTER</kbd> or press the tick button.

To avoid clicking the extension with the mouse, you can use the command bar.

1. Press <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>P</kbd> to open it up, select _Auto Commit Message_ and press enter or click it.
1. Your cursor will move to the commit message box, so now you can press commit with the keyboard. Use <kbd>CTRL</kbd>+<kbd>ENTER</kbd>.


### Remove
> How to uninstall the extension if you don't want it anymore

1. Go to the Extensions tab
2. Click the extension.
3. Click _uninstall_.

Or

1. Run this command.
    ```sh
    $ code --uninstall-extension MichaelCurrin.auto-commit-msg
    ```
2. Restart VS Code.
