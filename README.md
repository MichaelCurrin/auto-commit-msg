# Auto Commit Message ⚙️ 🧙‍♂️ ✉️
> A VS Code extension to generate a smart commit message based on file changes

<!-- Badges mostly generated with https://michaelcurrin.github.io/badge-generator/#/ -->

[![Node CI](https://github.com/MichaelCurrin/auto-commit-msg/workflows/Node%20CI/badge.svg)](https://github.com/MichaelCurrin/auto-commit-msg/actions?query=workflow:"Node+CI")
[![CodeQL](https://github.com/MichaelCurrin/auto-commit-msg/workflows/CodeQL/badge.svg)](https://github.com/MichaelCurrin/auto-commit-msg/actions?query=workflow%3ACodeQL)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license "Go to License section")
[![Contributions - welcome](https://img.shields.io/badge/Contributions-welcome-blue)](/CONTRIBUTING.md "View contributing doc")


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
![maintained - yes](https://img.shields.io/badge/maintained-yes-blue)

</a>

<!-- TODO: Fix in marketplace as it becomes plain text

**[Getting started](#getting-started) | [Features](#features) | [Screenshots](#sample-usage) | [Documentation](#documentation)**

-->
    
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
- Can handle multiple files at once.
- Based on paths and extensions, infers a **Conventional Commit** prefix type e.g. `feat`, `chore`, `ci`, `build`, `build(deps)`, `docs`.

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

Guides for installing and using the pre-built extension and for developers to build from source code.

<div align="center">

[![view - Documentation](https://img.shields.io/badge/view-Documenation-blue?style=for-the-badge)](/docs/)

</div>


## Contributing

See the [Contributing](/CONTRIBUTING.md) guide.


## License

Released under [MIT](/LICENSE) by [@MichaelCurrin](https://github.com/MichaelCurrin).

See the [Credit](/docs/other/credit.md) doc for more info.
