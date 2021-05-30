# Conventional commits

Info on the Conventional Commit standard and how it is applied in this project.


## Resources

- [conventionalcommits.org](https://www.conventionalcommits.org) homepage
- [config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#type-enum)


## Overview

Here is the full syntax:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

Description is meant to start with a lowercase letter.

This project focuses only on the first part:

```
<TYPE>(SCOPE): MESSAGE
```


## Type

e.g.

```
feat: add foo
```

From the docs:

> Commits MUST be prefixed with a type, which consists of a noun, feat, fix, etc., followed by a colon and a space.


## Scope

This would be specific to concepts and directories in a particular project, however, there are some in this project which can generalized.

e.g.

```
build(deps): upgrade packages
```

From the docs:

> An optional scope MAY be provided after a type.
>
> A scope is a phrase describing a section of the codebase enclosed in parenthesis.
>
> e.g. 'fix(parser):'
