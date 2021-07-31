# Auto Commit Message ⚙️ 🧙‍♂️ ✉️
> A VS Code extension that writes commit messages for you

<!-- Badges generated with https://michaelcurrin.github.io/badge-generator/#/ -->

[![Node CI](https://github.com/MichaelCurrin/auto-commit-msg/workflows/Node%20CI/badge.svg)](https://github.com/MichaelCurrin/auto-commit-msg/actions?query=workflow:"Node+CI")
[![CodeQL](https://github.com/MichaelCurrin/auto-commit-msg/workflows/CodeQL/badge.svg)](https://github.com/MichaelCurrin/auto-commit-msg/actions?query=workflow%3ACodeQL)
[![Known Vulnerabilities](https://snyk.io/test/github/MichaelCurrin/auto-commit-msg/badge.svg?targetFile=package.json)](https://snyk.io/test/github/MichaelCurrin/auto-commit-msg?targetFile=package.json)


[![GitHub release](https://img.shields.io/github/release/MichaelCurrin/auto-commit-msg?include_prereleases&sort=semver)](https://github.com/MichaelCurrin/auto-commit-msg/releases/)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)
![maintained - yes](https://img.shields.io/badge/maintained-yes-blue)
![GitHub last commit](https://img.shields.io/github/last-commit/MichaelCurrin/auto-commit-msg)
[![contributions - welcome](https://img.shields.io/badge/contributions-welcome-blue)](/CONTRIBUTING.md)

[![Made with Node.js](https://img.shields.io/badge/Node.js->=12-blue?logo=node.js&logoColor=white)](https://nodejs.org)
[![Package - Typescript](https://img.shields.io/github/package-json/dependency-version/MichaelCurrin/auto-commit-msg/dev/typescript?logo=typescript&logoColor=white)](https://www.npmjs.com/package/typescript)

<div align="center">

<a href="/docs/quickstart.md" title="Go to docs quickstart">
    <img src="/images/icon.png" alt="Logo" width="200" />
    <br/>
    <img src="https://img.shields.io/badge/VS_Code_Extension-blue.svg?logo=visual-studio-code" alt="VS Code Extension" />
</a>

[Getting started](#getting-started) | [Features](#features) | [Sample screenshots](#sample-usage) | [Docs](#documentation)

</div>


## Preview

<div align="center">
    <img src="/docs/_media/sample-feat.png" alt="feat" title="feat" width="300" />
</div>


## Getting started

This is a [VS Code extension](https://code.visualstudio.com/).

_I'm still streamlining the experience to download from the VS Code Marketplace. For now, use a manual approach._

The guide here shows you how to download a _pre-built_ extension from GitHub Releases and then install it in VS Code.

<div align="center">

[![docs - getting started](https://img.shields.io/badge/docs-getting_started-2ea44f?style=for-the-badge)](https://github.com/MichaelCurrin/auto-commit-msg/blob/master/docs/quickstart.md)

</div>


## Features

- Just click the extension button in the Git pane.
- It reads the state of files in your Git repo or staged files.
- Generates a commit message, which you can use or edit.
- Describes a variety of changes - when a file is added, removed, moved, renamed, etc.
- Handles multiple files at once.
- Infers a _Conventional Commit_ type where possible - e.g. `feat`, `ci`, `build`.
- It can recognize a range of files based on path and extension. Such as related to config files, CI files, dependency files (for JavaScript, Python, etc.), or documentation.

See more info on the [Features](/docs/features.md) page in the docs.


## Sample usage

Here are some screenshots of what messages the extension generates based on changed files.

If you created a new file and staged it:

<div align="center">
    <img src="/docs/_media/sample-feat.png" alt="feat" title="feat" width="250" />
</div>

If you updated a build-related file:

<div align="center">
    <img src="/docs/_media/sample-build.png" alt="build" title="build" width="250" />
</div>

If updated a file in `docs/` or a `README.md` anywhere:

<div align="center">
    <img src="/docs/_media/sample-docs.png" alt="docs" title="docs" width="250" />
</div>

If you renamed a file:

<div align="center">
    <img src="/docs/_media/sample-rename.png" alt="rename" title="rename" width="250" />
</div>


<!-- TODO: Add GIF here -->


## When auto-generated messages are good

This is a time-saving tool. You get to spend more time writing code and solving problems. And less time on figuring out what to write for a commit message or typing the message.

You can probably use this tool to generate messages for **80%** of your commits. Where the changes are rather mundane. And where the effort and time to write out a commit

But remember to **manually** write explanatory messages for the other 20% of the time, where a commit message composed by a human is valuable. Or take the generated message and tweak it with more detail.


## About

A VS Code extension that gives you smart commit message suggestions. For the times where all your need is a simple message.

It looks at the path of a file that changed and how it changed, then pushes the commit message to the Git pane in VS Code. You can edit or erase the message if you don't like it.

It can make a message to **describe a change** for a single file to commit. Including "create", "update", "remove", "rename" and "move" - along with the filename. Or the path, like for a move. See the [message.test.ts](/src/test/generate/message.test.ts) test spec.

In many cases, it can also provide an appropriate **Conventional Commit** type for you, as a commit message prefix.


## Documentation

<div align="center">

[![view - Documentation](https://img.shields.io/badge/view-Documenation-blue?style=for-the-badge)](/docs/)

</div>


## Contributing

See the [Contributing](/CONTRIBUTING.md) guide.


## License

Released under [MIT](/LICENSE) by [@MichaelCurrin](https://github.com/MichaelCurrin).

See [Credit](/docs/other/credit.md) section the docs for more info.
