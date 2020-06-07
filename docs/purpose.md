# Purpose


## Why?

Yes, before you ask, yes I _know_ that meaningful commit messages are meaningful to future me and other developers in understanding intent or the reason for a change.

But I also find that the majority of commits I make have messages that could be generated programmatically. Based on the pareto principle, probably 80% of them. The messages easy to compute, or the change is so small (a few lines changed) that is does not have much meaning on its own until the "feature" or "fix" is complete through many commits (formalized with a Pull Request or tag). And sometimes I am working on a small personal project or writing docs which are not code so it matters to me more than I can commit frequently than than every message is meaningful and handwritten.

Additionally, there are some messages which are easy to figure out and write using an algorithm and not so nice to type precisely. e.g. `Update 5 files and created 2 files`. Or `Created 2 files in foo/bar`. This can be prefaced with a manual "fix: " or "feat: " to make the intent clear. 

I do a lot of frequent, small commits to store my working changes - they "atomic", at least when I make sure the code is working at each commit. Which means that a lot of my commits are small incremental changes around adding or fixing code or docs, or renaming or moving files. There is friction to thinking of and typing the message - so when I am stressed or tired I might end up taking unwanted shortcuts. Like commiting less often (then its harder to figure out what broke and what change to undo). Or I write shorter and simple messages. `Add heading to README.md` becomes `Add heading` or `Update README`.

Occassionally there is a commit which needs explaining because it is a significant change in the how things work, or I want to elegant capture why a lot of files changed for the same or a similar reason. So I like to write descriptive message then. And the idea with this tool is that you can go always override the auto-generated message with your own (much like Github's default commit message).


## Other auto commit tools

### Github

This tool is inspired by Github's own default commit messages - the grey text which is used if you don't enter a commit message.

e.g.

```
Created foo.txt
Renamed foo.txt to bar.txt
Updated bar.txt
```

But while Github only lets you change one file at a time and generate a message based on that, this tool is smart enough to generate a message based on all the files to be committed.

Also note that wisdom I read online about commit messages says that a commit should be imperative and not past tense, which also makes more sense when reverting a commit.

e.g.

```
Create foo.txt
```

### StackEdit

- [Stackedit.io](https://stackedit.io)

This tool lets you edit markdown files with a preview sidebar. And it automatically saves your files every few minutes, reducing friction.

It generates a message that includes StackEdit in the name. e.g.

```
README.md updated from https://stackedit.io/ 
```
 
