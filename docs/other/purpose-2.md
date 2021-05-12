# Purpose

This is a VS Code extension - when you run it, it will look at files changed and then generate a commit message for you and add it to the commit message box (using the Git Extension's UI).

It will look at files that are staged. If there are none, then it will look all changed unstaged files instead. The result will be a simple, descriptive message that fits on one line.

Note: At the moment a message can be generated based on one changed file.

The idea of this tool is to take the friction out of writing commit messages, so you that you commit more frequently (such as a with more one-line changes rather than mixing multiple unrelated changes together) and to save having to type out details that can be automatic or a tedious (mentioning long or difficult-to-type paths or filenames). This tool is not mean to be perfect - it gives a best guess for common cases.

It also not meant to replace writing messages by hand. It is a tool for myself mainly - 80% of my commit messages could have been written by an algorithm.

And for the other 20% when the change is important to describe in detail or hard to figure out programmatically (like class renames or bug fix descriptions), then I can still write my manual commit message.

This tool was inspired partly by GitHub's UI - it suggests a message in grey like "Update README.md" when I edit that file and if I enter nothing it uses that.

There are many tools out there that will _lint_ your commit message, or provide you a multi-line template, or will insert something in it like "feat:" or an emoji. But AutoCommitMsg writes you entire commit message for you in one line.

<!--
## Notes

This project is in development - it is very unstable and unpredictable but you can use the scripts or docs if they make sense to you. The focus has shifted away from making a terminal hook because VS Code handles is weirdly and on every UI commit, even if you only plan use it on the terminal.

I am please to announced that this now a lot more stable as of `v0.7.0`, but is not production ready (mainly cosmetic issues and a need to smooth the packaging flow). Next are items in GH issues, unchecked features list below, a local TODO file, some Conventional Commit functions to use and some renaming tests to work on.

This is my first VS Code extension and first TypeScript project, so I am learning as a go and trying to follow best practices I find.
-->
