# Quickstart

How to install and run the extension in VS Code.


##  Install

Go to the Marketplace link below, then click the _Install_ button.

<div align="center">

[![VS Code Marketplace - Auto Commit Message](https://img.shields.io/badge/VS_Code_Marketplace-Auto_Commit_Message-2ea44f?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=MichaelCurrin.auto-commit-msg)

</div>


## Run

Use the extension like this:

1. Open VS Code.
1. Open a project which is a Git repo.
1. Edit one or more files and save them.
1. Optionally stage one of the files.
    - This is useful if want smaller changes in your commit and your commit message.
    - Staging is necessary if you do a _move_ or _rename_ action, so that Git sees the old and new path as the _same_ file. But otherwise, you don't have to stage.
1. In VS Code's built-in Git pane, click the Auto Commit Message icon.
1. The extension will create a descriptive commit message for you in the commit message box.
1. Optionally edit your message.
1. Commit - click the tick symbol button. Or <kbd>Control</kbd>+<kbd>Enter</kbd> or <kbd>CMD</kbd>+<kbd>Enter</kbd>.
