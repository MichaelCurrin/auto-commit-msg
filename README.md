# Auto Commit Message ⚙️ 🧙‍♂️ ✉️
> A VS Code extension to generate a smart commit message based on file changes

<!-- Badges mostly generated with https://michaelcurrin.github.io/badge-generator/#/ -->

[![Node CI](https://github.com/MichaelCurrin/auto-commit-msg/workflows/Node%20CI/badge.svg)](https://github.com/MichaelCurrin/auto-commit-msg/actions?query=workflow:"Node+CI")
[![CodeQL](https://github.com/MichaelCurrin/auto-commit-msg/workflows/CodeQL/badge.svg)](https://github.com/MichaelCurrin/auto-commit-msg/actions?query=workflow%3ACodeQL)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license "Go to License section")
[![Contributions - welcome](https://img.shields.io/badge/Contributions-welcome-blue)](/CONTRIBUTING.md "View contributing doc")

[![Known Vulnerabilities](https://snyk.io/test/github/MichaelCurrin/auto-commit-msg/badge.svg?targetFile=package.json)](https://snyk.io/test/github/MichaelCurrin/auto-commit-msg?targetFile=package.json)
[![Made for VS Code](https://img.shields.io/badge/Made_for-VS_Code-blue?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/ "Go to VS Code homepage")
[![Made with Node.js](https://img.shields.io/badge/Node.js->=14-blue?logo=node.js&logoColor=white)](https://nodejs.org "Go to Node.js homepage")
[![Package - Typescript](https://img.shields.io/github/package-json/dependency-version/MichaelCurrin/auto-commit-msg/dev/typescript?logo=typescript&logoColor=white)](https://www.npmjs.com/package/typescript "Go to TypeScript homepage")


<div align="center">

<!-- Must not be SVG. Also all image URLs must be full HTTPS URLs - absolute paths. -->
<a href="https://marketplace.visualstudio.com/items?itemName=MichaelCurrin.auto-commit-msg"
    title="Go to Marketplace extension page">

<img src="https://github.com/MichaelCurrin/auto-commit-msg/raw/master/images/icon.png"
    alt="Logo"
    width="200" />

![VS Code extension marketplace version](https://img.shields.io/visual-studio-marketplace/v/MichaelCurrin.auto-commit-msg)
![VS Code extension installs](https://img.shields.io/visual-studio-marketplace/i/MichaelCurrin.auto-commit-msg)
![VS Code extension rating](https://img.shields.io/visual-studio-marketplace/r/MichaelCurrin.auto-commit-msg)
![VS Code extension release date](https://img.shields.io/visual-studio-marketplace/release-date/MichaelCurrin.auto-commit-msg)
![maintained - yes](https://img.shields.io/badge/maintained-yes-blue)

</a>

[Getting started](#getting-started) | [Features](#features) | [Sample screenshots](#sample-usage) | [Docs](#documentation)

</div>


## Preview

Starting from an empty commit message, the extension created a recommended message and populated it inside the Git pane of VS Code:

<div align="center">
    <img src="https://github.com/MichaelCurrin/auto-commit-msg/raw/master/docs/_media/sample-chore.png"
        alt="sample screenshot of chore"
        width="300" />
</div>

<!-- TODO: Add GIF here -->


## Getting started

How to install and run the extension in VS Code.

<div align="center">

[![docs - Getting started](https://img.shields.io/badge/docs-getting_started-2ea44f?style=for-the-badge)](/docs/quickstart.md)

</div>


## Features

Just click the extension's one **button** in the Git pane.

This is what the extension can do:

- Look at any **staged** changes files, otherwise falls back to all unstaged changes.
- Generate a commit message, which you can use or edit.
- It can describe a variety of changes - when a file is added, removed, moved, renamed, etc.
- Handles multiple files at once.
- Infers a **Conventional Commit** prefix type where possible - e.g. `feat`, `ci`, `build`.
- It can recognize a range of files based on path and extension. Such as related to config files, CI files, dependency files (for JavaScript, Python, etc.), or documentation.

See more info on the [Features](/docs/features.md) page in the docs.


## Comparison with other extensions

Other extensions usually require some manual input, such as selecting prefix type from a droplist or writing a commit message by hand.

This extension takes _zero_ parameters. Just click a button.


## Sample usage

Here are some screenshots of what messages the extension generates based on changed files.

If you created a new file and staged it:

<div align="center">
    <img src="https://github.com/MichaelCurrin/auto-commit-msg/raw/master/docs/_media/sample-feat.png" alt="feat" title="feat" width="250" />
</div>

If you updated a build-related file:

<div align="center">
    <img src="https://github.com/MichaelCurrin/auto-commit-msg/raw/master/docs/_media/sample-build.png" alt="build" title="build" width="250" />
</div>

If updated a file in `docs/` or a `README.md` anywhere:

<div align="center">
    <img src="https://github.com/MichaelCurrin/auto-commit-msg/raw/master/docs/_media/sample-docs.png" alt="docs" title="docs" width="250" />
</div>

If you renamed a file:

<div align="center">
    <img src="https://github.com/MichaelCurrin/auto-commit-msg/raw/master/docs/_media/sample-rename.png" alt="rename" title="rename" width="250" />
</div>


## Documentation

<div align="center">

[![view - Documentation](https://img.shields.io/badge/view-Documenation-blue?style=for-the-badge)](/docs/)

</div>


## Contributing

See the [Contributing](/CONTRIBUTING.md) guide.


## License

Released under [MIT](/LICENSE) by [@MichaelCurrin](https://github.com/MichaelCurrin).

See the [Credit](/docs/other/credit.md) doc for more info.
