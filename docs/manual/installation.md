# VS Code extension

This project installable as a VS Code extension.

For now, it is only available for dev testing, but eventually will be installable for anyone using a download file (maybe even using the marketplace).


## Install extension
> Instructions for end-users

Here we install the extension from pre-built file. This is extension is **not available** in the VS Code marketplace yet, but you download it from GitHub.

### Using a GUI

1. In the browser.
    1. Go to the GitHub Releases page.
        - [![view - releases](https://img.shields.io/badge/view-releases-2ea44f?style=for-the-badge&logo=github)](https://github.com/MichaelCurrin/auto-commit-msg/releases)
    1. Find the latest release.
    1. Expand the _Assets_ section.
    3. Download a copy of the `.vsix` archive file by clicking on the filename.
1. In VS Code
    1. Open the Command Pallette (_View_ then _Command Pallette_).
    1. Type `extension`, wait for the auto-complete, then select _Extension: Install from VSIX..._.
    1. Select the file downloaded earlier.f 
    3. Make sure to **restart** VS Code to get the extension loaded.

### Using the terminal

Instructions for macOS / Linux.

1. Identify the latest release number on the GitHub Releases page.
    - [![view - releases](https://img.shields.io/badge/view-releases-2ea44f?style=for-the-badge&logo=github)](https://github.com/MichaelCurrin/auto-commit-msg/releases)
1. Download the `.vsix` extension file using `curl`, using the appropriat target version.
    ```sh
    $ cd ~/Downloads
    $ TARGET='0.19.0'
    $ curl -L -O "https://github.com/MichaelCurrin/auto-commit-msg/releases/download/v$TARGET/auto-commit-msg-$TARGET.vsix"
    ```
1. Install the extension. Here we run VS Code in the CLI against path to the downloaded file (no need to unzip it first).
    ```sh
    $ code --install-extension PATH
    ```
    e.g.
    ```sh
    $ code --install-extension ~/Downloads/auto-commit-msg-0.19.0.vsix
    ```
    ```
    Installing extensions...
    Extension 'auto-commit-msg-0.18.0.vsix' was successfully installed.
    ```
1. If you have VS Code running already, make sure to **restart** it to get the extension loaded.


## Next

Continue to [Usage](usage.md) doc.
