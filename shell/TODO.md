- [ ] For now this points to the output directory so it limited in real world use. This is a stepping
stone. But ideally the JS files can be copied outside of this project to a central location (maybe
with a `bin` entry point). And the SH script can be added to an individual project in `.git/hooks` dir as `prepare-commit-msg`.
- [ ] When using this as a hook, consider reading from the **existing** commit message file in the case
of template, so it that can be passed on.
- [ ] Add a flag for staged to get `--cached` flag.
- [ ] How to automated the install process for upgrades. Maybe the JS + shell script as NPM package or at least on GitHub with cURL install.
- [ ] Figure out how to switch between staged and not, with `--cached`. Like passing a param to the shell script and having two aliases. Or to have it as pass of the shell script to fallback to all if anything is staged. Or just control with filenames e.g. `git c .` or `git c package*` - oh wait, the shell script doesn't look at what is passed to `git commit`, only what is staged or not.
- [ ] Fix bug where message is on modified and staged but only staged is committed with gacm or acm

    If the flag is omitted, then the standard `git status` logic is followed:
    look for staged changes and use them, otherwise use unstaged changes.
    there's a problem - commit does not take cached flag - but it will use implied staged or not. so do not pass through.
    BUT could look at advanced mode of pass through names of files to commit IF they are handled by status and commit, but using manual git add is good enough probably. esp for untracked files which need add anyway.
- [ ] See if it is possible to make the shell script here shorter and use the logic in acm instead and a minimal .sh hook file.
- [ ] Fix issue where if using the `cli:install` command then doing a build that removes everything means the commands don't work. Perhaps a **different output directory**.
- [ ] Rename - this doesn't have to be shell anymore. Like `hooks`. Just fix any references to shell directory.
