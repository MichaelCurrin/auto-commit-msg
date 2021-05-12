# Usage
> How to use extension after it has been installed

<!-- TODO Image would be useful. -->

With the extension installed, open VS Code at the root of a git repo.

<!--

Follow the usage steps below:

1. Edit files.
    1. Save changes to file.
    1. Optionally stage a file to target that one.
        - In the case of a new file, you must stage it.
        - In the case of a renamed file you **must** stage it, otherwise `git` will see it as one new file and one deleted file and the extension will only see the delete one.
1. Generate a commit message.
    1. Open the _Source Control_ panel to use the Git extension.
    1. Press the _Auto Commit Msg_ button.
    1. Optionally refine the commit message.
1. Commit.
    1. Press the Commit checkbox button.

-->

1. Open VS Code.
2. Go to the Source Control (Git Extension) tab. You'll see this extension added.
3. Make a change to a file and use the Source Control pane to stage a file.
4. Click the extension button.
5. You'll see a message added the commit message box. Edit it if you want.
6. Commit with the VS Code UI. e.g. Use <kbd>CTRL</kbd>+<kbd>ENTER</kbd> or press the tick button.

To avoid having to use the extension with the mouse, you can use the command bar:

1. Press <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>P</kbd> to open it up, select _Auto Commit Message_ and press enter or click it.
1. Your cursor will move to the commit message box, so now you can press commit with the keyboard. Use <kbd>CTRL</kbd>+<kbd>ENTER</kbd>.
