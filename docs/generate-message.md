# Generate message

This tool aims to prepare a smart commit message for you at the point you commit. Unfortunately, VS Code does not work with git hooks so this flow only works when commit on the command-line.

This is to take the effort out of writing self-explantory commits, where the machine can write a message I would write for a simple case. And where looking at the diff output is sufficient to see the _why_.

This tool does not require you to always use the auto-generated message - it simply makes it available if you enable it. If there is something that needs to be captured like that a commit is fix or the reason for a fix or a high-level description of the changes made (like renamed variabled), then write the message by hand.


## Hook flow

Here is the flow for using any `prepare-commit-msg` hook, not specific to this project:

1. Edit file in your project.
1. Commit on command-line.
1. Prepare commit message (this internally can look for the template as per the sample).
1. Override value with own message if desired.
1. Exit message editor view.
1. Commit is made.
