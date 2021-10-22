# Conventional Commits

Info on how the Conventional Commits standard is applied for generating output in this project.


## Resources

- [Conventional Commits](https://www.conventionalcommits.org) homepage
- [Conventional Commits](https://michaelcurrin.github.io/dev-cheatsheets/cheatsheets/other/conventional-commits.html) cheatsheet in my Dev Cheatsheets projects, covering parts of the standard most relevant to me and this extension project.


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
