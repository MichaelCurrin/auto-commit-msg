# Auto Commit Message ⚙️ 🧙‍♂️ ✉️
> A VS Code extension to generate a smart commit message based on file changes

<!-- Badges generated with https://michaelcurrin.github.io/badge-generator/#/ -->

[![Node CI](https://github.com/MichaelCurrin/auto-commit-msg/workflows/Node%20CI/badge.svg)](https://github.com/MichaelCurrin/auto-commit-msg/actions?query=workflow:"Node+CI")
[![CodeQL](https://github.com/MichaelCurrin/auto-commit-msg/workflows/CodeQL/badge.svg)](https://github.com/MichaelCurrin/auto-commit-msg/actions?query=workflow%3ACodeQL)
[![Known Vulnerabilities](https://snyk.io/test/github/MichaelCurrin/auto-commit-msg/badge.svg?targetFile=package.json)](https://snyk.io/test/github/MichaelCurrin/auto-commit-msg?targetFile=package.json)


[![GitHub release](https://img.shields.io/github/release/MichaelCurrin/auto-commit-msg?include_prereleases&sort=semver)](https://github.com/MichaelCurrin/auto-commit-msg/releases/)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)
![maintained - yes](https://img.shields.io/badge/maintained-yes-blue)
![GitHub last commit](https://img.shields.io/github/last-commit/MichaelCurrin/auto-commit-msg)
[![contributions - welcome](https://img.shields.io/badge/contributions-welcome-blue)](/CONTRIBUTING.md)

[![Made for VS Code](https://img.shields.io/badge/Made_for-VS_Code-blue)](https://code.visualstudio.com/)
[![Made with Node.js](https://img.shields.io/badge/Node.js->=12-blue?logo=node.js&logoColor=white)](https://nodejs.org)
[![Package - Typescript](https://img.shields.io/github/package-json/dependency-version/MichaelCurrin/auto-commit-msg/dev/typescript?logo=typescript&logoColor=white)](https://www.npmjs.com/package/typescript)


<div align="center">

<a href="https://marketplace.visualstudio.com/items?itemName=MichaelCurrin.auto-commit-msg"
    title="Go to Marketplace extension page">
    <img src="/images/icon.png" alt="Logo" width="200" />
    <br/>
    <img src="https://img.shields.io/badge/VS_Code_Extension-blue.svg?logo=visual-studio-code" alt="VS Code extension" />
</a>

[Getting started](#getting-started) | [Features](#features) | [Sample screenshots](#sample-usage) | [Docs](#documentation)

</div>


## Preview

<div align="center">
    <img src="/docs/_media/sample-feat.png" alt="feat" title="feat" width="300" />
</div>


## Getting started

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


## Documentation

<div align="center">

[![view - Documentation](https://img.shields.io/badge/view-Documenation-blue?style=for-the-badge)](/docs/)

</div>


## Contributing

See the [Contributing](/CONTRIBUTING.md) guide.


## License

Released under [MIT](/LICENSE) by [@MichaelCurrin](https://github.com/MichaelCurrin).

See the [Credit](/docs/other/credit.md) doc for more info.
