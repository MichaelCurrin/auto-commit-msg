# Auto Commit Message ⚙️🧙‍♂️ ✉️
> A VS Code extension that writes commit messages for you

<!-- Badges generated with https://michaelcurrin.github.io/badge-generator/#/ -->

[![Node CI](https://github.com/MichaelCurrin/auto-commit-msg/workflows/Node%20CI/badge.svg)](https://github.com/MichaelCurrin/auto-commit-msg/actions?query=workflow:"Node+CI")
[![CodeQL](https://github.com/MichaelCurrin/auto-commit-msg/workflows/CodeQL/badge.svg)](https://github.com/MichaelCurrin/auto-commit-msg/actions?query=workflow%3ACodeQL)
[![Known Vulnerabilities](https://snyk.io/test/github/MichaelCurrin/auto-commit-msg/badge.svg?targetFile=package.json)](https://snyk.io/test/github/MichaelCurrin/auto-commit-msg?targetFile=package.json)
[![GitHub release](https://img.shields.io/github/release/MichaelCurrin/auto-commit-msg?include_prereleases&sort=semver)](https://github.com/MichaelCurrin/auto-commit-msg/releases/)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)

[![Made with Node.js](https://img.shields.io/badge/Node.js->=12-blue?logo=node.js&logoColor=white)](https://nodejs.org)
[![Package - Typescript](https://img.shields.io/github/package-json/dependency-version/MichaelCurrin/auto-commit-msg/dev/typescript?logo=typescript&logoColor=white)](https://www.npmjs.com/package/typescript)


<div align="center">

<a href="/docs/quickstart.md">
    <img src="/images/icon.png" alt="Logo" title="Logo" width="200" />
</a>

[![VS Code Extension](https://img.shields.io/badge/VS_Code_Extension-blue.svg?logo=visual-studio-code)](https://code.visualstudio.com/)

[Quickstart](/docs/quickstart.md) | [Sample screenshots](#samples) | [Features](#features) | [Docs](#documentation)

</div>


## Getting started

This guide shows you how to download a _pre-built_ extension from GitHub Releases and then install it in VS Code (you can't find it on the extension marketplace yet).

<div align="center">

[![docs - getting started](https://img.shields.io/badge/docs-getting_started-2ea44f?style=for-the-badge)](https://github.com/MichaelCurrin/auto-commit-msg/blob/master/docs/quickstart.md)

</div>


## Release disclaimer

- This application is still in **pre-release** stage.
- But... it is still functional and I use it daily, so please use it too if you want.
- There are just some finishing touches still, like making a new logo, releasing the package on the marketplace (so you can install it without downloading from releases page) and cleaning up the docs. It can become version `1.0.0` around then.
- There are also a bunch of issues I want to work through to extend functionality to make the extension smarter.


## Sample

Here are some screenshots of what messages the extension generates, based on changed files.

If you created a new file and staged it.

<div align="center">
    <img src="/docs/_media/sample-feat.png" alt="feat" title="feat" width="250" />
</div>

If you updated a build-related file.

<div align="center">
<img src="/docs/_media/sample-build.png" alt="build" title="build" width="250" />
</div>

If updated a file in `docs/` or a `README.md` anywhere.

<div align="center">
<img src="/docs/_media/sample-docs.png" alt="docs" title="docs" width="250" />
</div>

If you renamed a file.

<div align="center">
    <img src="/docs/_media/sample-rename.png" alt="rename" title="rename" width="250" />
</div>


<!-- TODO: Add GIF here -->


## About

A VS Code extension which gives you smart commit message suggestions. For the times where all your need it a simple message.

It looks at the path of a file that changed and how it changed, then pushes the commit message to the Git pane in VS Code. You can edit or erase the message if you don't like.

It can make a message to **describe a change** for a single file to be committed. Including create, update, remove, rename and move - along with the filename. Or, the path, like for a move. See the [tests](https://github.com/MichaelCurrin/auto-commit-msg/blob/master/src/test/message.test.ts).

It many cases it can also provide an appropriate **conventional commit** prefix label for you. It can't separate features and bug fixes but it can identify changes to docs, CI files and config files.

Don't use this tool all the time - remember to write explanatory messages when it matters.


## Documentation

<div align="center">

[![view - Documentation](https://img.shields.io/badge/view-Documenation-blue?style=for-the-badge)](/docs/)

[![view - Wiki](https://img.shields.io/badge/view-Wiki-blue?style=for-the-badge)](https://github.com/MichaelCurrin/auto-commit-msg/wiki)

</div>


## License

Released under [MIT](/LICENSE) by [@MichaelCurrin](https://github.com/MichaelCurrin).

See [Credit](/docs/credit.md) section the docs for more info.
