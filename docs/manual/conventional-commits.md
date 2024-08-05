# Conventional Commits

Info on how the Conventional Commits standard is applied for generating output in this project.


## Resources

- The official [Conventional Commits](https://www.conventionalcommits.org) homepage
- My [Conventional Commits cheatsheet](https://michaelcurrin.github.io/dev-cheatsheets/cheatsheets/other/conventional-commits.html) in my Dev Cheatsheets projects, covering parts of the standard most relevant to me and this extension project.


## The official standard

Here is the full syntax for a commit message:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

The standard says that description is meant to start with a _lowercase letter_, so this is applied throughout this project.


## What this project uses

The body and footer are ignored in this project, to keep things simple. Perhaps, one day, some details will be added to the body by this extension.

So then the format of generated messages:

- `TYPE: DESCRIPTION`
- `TYPE(SCOPE): DESCRIPTION`

Additionally, a custom message is allowed:

- `CUSTOM_MESSAGE TYPE: DESCRIPTION`

Here are some sample messages that this extension creates:

- `feat: create foo.txt`
- `build: update Makefile`
- `build(deps): update package-lock.json`
- `docs: update README.md`
- `test: update foo.spec.js`
- `chore: rename fizz.txt to buzz.txt`

See [Sample usage](https://github.com/MichaelCurrin/auto-commit-msg#sample-usage) for screenshots.
