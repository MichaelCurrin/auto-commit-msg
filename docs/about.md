## About

A VS Code extension that gives you smart commit message suggestions. For the times where all your need is a simple message.

It looks at the path of a file that changed and how it changed, then pushes the commit message to the Git pane in VS Code. You can edit or erase the message if you don't like it.

It can make a message to **describe a change** for a single file to commit. Including "create", "update", "remove", "rename" and "move" - along with the filename. Or the path, like for a move. See the [message.test.ts](/src/test/generate/message.test.ts) test spec.

In many cases, it can also provide an appropriate **Conventional Commit** type for you, as a commit message prefix.


## When auto-generated messages are good

This is a time-saving tool. You get to spend more time writing code and solving problems. And less time on figuring out what to write for a commit message or typing the message.

You can probably use this tool to generate messages for **80%** of your commits. Where the changes are rather mundane. And where the effort and time to write out a commit

But remember to **manually** write explanatory messages for the other 20% of the time, where a commit message composed by a human is valuable. Or take the generated message and tweak it with more detail.
