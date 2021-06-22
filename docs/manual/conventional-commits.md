# Conventional Commits

Info on how the Conventional Commits standard is applied for generating output in this project.


## Resources

- [Conventional Commits](https://www.conventionalcommits.org) homepage


## Overview

Here is the full syntax for a commit message:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

The standard says that description is meant to start with a _lowercase letter_, so this is applied throughout this project.

This Auto Commit Extension project focuses only on the first part:

```
<TYPE>(SCOPE): DESCRIPTION
```

Perhaps one day some details will be added to the body.


## Type

A prefix for the commit message describing the type of the change.

This should be only one of the types defined in the standard.

See [allowed types](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#type-enum) defined in the docs of the `config-conventional` section of the `commitlint` repo.

Here is an example of the feature type used as a prefix.

```
feat: add foo
```

A documentation change:

```
docs: fix typo in foo.md and bar.md
```

From the docs:

> Commits MUST be prefixed with a type, which consists of a noun, feat, fix, etc., followed by a colon and a space.


## Scope

The standard defines use of an optional scope, which is used in additional to the required type.

From the docs:

> An optional scope MAY be provided after a type.
>
> A scope is a phrase describing a section of the codebase enclosed in parenthesis.
>
> e.g. 'fix(parser):'
This would be specific to a particular project, so you cannot know the generalize scopes for all projects. The standard says you should agree in your team what the scopes would be. Perhaps based on features, projects or directories.

I believe there are some scope values which do generalize well.

All dependency changes can have scope of `deps`.

Some possible examples.

```
build(deps): upgrade packages
style(deps): remove whitespace in requirements.txt
fix(deps): correct typo in package.json package name
```

