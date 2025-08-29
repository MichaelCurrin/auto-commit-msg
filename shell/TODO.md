- [ ] For now this points to the output directory so it limited in real world use. This is a stepping
stone. But ideally the JS files can be copied outside of this project to a central location (maybe
with a `bin` entry point). And the SH script can be added to an individual project in `.git/hooks` dir as `prepare-commit-msg`.
- [ ] When using this as a hook, consider reading from the **existing** commit message file in the case
of template, so it that can be passed on.
- [ ] Add a flag for staged to get `--cached` flag.
- [ ] How to automated the install process for upgrades. Maybe the JS + shell script as NPM package or at least on GitHub with cURL install.
- [ ] Figure out how to switch between staged and not, with `--cached`. Like passing a param to the shell script and having two aliases. Or to have it as pass of the shell script to fallback to all if anything is staged. Or just control with filenames e.g. `git c .` or `git c package*` - oh wait, the shell script doesn't look at what is passed to `git commit`, only what is staged or not.
