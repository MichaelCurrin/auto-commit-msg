# Usage
> How to use the extension

<!-- This has overlap with Run of Quickstart guide. Image would be useful. -->

With the extension installed, open VS Code at the root of a git repo.

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
