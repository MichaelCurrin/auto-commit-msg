# VS Code extension

This project installable as a VS Code extension.

For now, it is only available for dev testing, but eventually will be installable for anyone using a download file (maybe even using the marketplace).


## Install extension
> Instructions for end-users

Here we use the terminal to install the extension from pre-built file. This is extension is **not available** in the VS Code marketplace yet, but you download it from GitHub.

1. Go to the GitHub Releases page.
    - [![view - releases](https://img.shields.io/badge/view-releases-2ea44f?style=for-the-badge&logo=github)](https://github.com/MichaelCurrin/auto-commit-msg/releases)
1. Find the latest release and expand the _Assets_ section.
1. Download a copy of the `.vsix` archive file.
    - Click on the filename. OR
    - In the shell, use `curl` (or `wget`).
        e.g.
        ```sh
        $ cd ~/Downloads
        $ TARGET='0.18.0'
        $ curl -L -O "https://github.com/MichaelCurrin/auto-commit-msg/releases/download/v$TARGET/auto-commit-msg-$TARGET.vsix"
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


Continue to [Usage](usage.md) doc.
