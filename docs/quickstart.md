# Quickstart
> How to get the pre-built extension installed in VS Code


## Set up and run the extension

Here is a short quick guide to get the extension installed globally in your VS Code using a downloaded file and then start using the extension.

You only need to have VS Code installed. You do not need to install any dependencies yourself or download this repo. 

### Install
> Use the terminal to install the extension from pre-built file

This is extension is **not available** in the VS Code marketplace yet, but you download it from GitHub.

1. Find the latest release on the GitHub [Releases](https://github.com/MichaelCurrin/auto-commit-msg/releases) page.
2. Download a copy of the `.vsix` asset on the latest release.
    - Click on the file.
    - Or use the shell. 
        e.g.
        ```sh
        $ cd ~/Downloads
        $ curl -O https://github.com/MichaelCurrin/auto-commit-msg/releases/download/v0.17.0/auto-commit-msg-0.17.0.vsix
        ```
5. Install the extension. Here we run VS Code in the CLI against the downloaded file.
    ```sh
    $ code --install-extension PATH
    ```
    e.g.
    ```sh
    $ code --install-extension ~/Downloads/auto-commit-msg-0.17.0.vsix
    ```
    ```
    Installing extensions...
    Extension 'auto-commit-msg-0.17.0.vsix' was successfully installed.
    ```

Continue to the section below for how to use the extension.

### Run
> How to use extension after it has been installed

1. Open VS Code. If it is already open, you'll need to restart it.
1. Go to the Source Control (Git Extension) tab. You'll see this extension added.
1. Make a change to a file and use the Soure Control pane to stage a file.
1. Click the extension button. 
1. You'll see a message added the commit message box. Edit it if you want.
1. Commit with the VS Code UI. e.g. Use <kbd>CTRL</kbd>+<kbd>ENTER</kbd> or press the tick button.

To avoid having to use the extension with the mouse, you can use the command bar:

1. Press <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>P</kbd> to open it up, select _Auto Commit Message_ and press enter or click it.
1. Your cursor will move to the commit message box, so now you can press commit with the keyboard. Use <kbd>CTRL</kbd>+<kbd>ENTER</kbd>.

### Remove
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
