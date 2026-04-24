# CLI Development
> Maintaining code around the CLI tool

The code is in [src/cli/](/src/cli). The CLI commands are built using steps set in [package.json](/package.json).

- See `cli:install` and `bin` section, which are both related and work with `npm link`.
- See `make cli-build` which is for building binaries with `pkg` for distribution. See [pkg](https://www.npmjs.com/package/pkg) page on NPM docs.

## Run directly

Run a script directly without compiling:

```sh
$ npx ts-node src/cli/diffIndexGenerate.ts
$ npx ts-node src/cli/diffIndexGenerateCommit.ts
$ npx ts-node src/cli/generate.ts
```

## Install globally

```sh
$ npm install
$ npm run cli:install
```

> [!WARNING]
> The files will be symlinked in a bin directory but those links can break if you run the clean and compile steps again for other development. So then installing using the binaries below (and a copy step) or the install script in [Releases](releases.md) is safer.

## Package as a binary

See [Releases](/docs/development/releases.md) for info on the release pipeline to publish the binaries.

Build the CLI as a binary which can be installed without the source code or Node.

```sh
$ make cli-build
```

> [!NOTE]
> In [Makefile](/Makefile), Node **18** is set to avoid errors from `pkg`. Even though 22 is set in package.json and is active with NVM. Check the [pkg docs](https://www.npmjs.com/package/pkg) for more info on available versions.

Check the [dist](/dist/) directory once it is created. These are added to a release.

## Troubleshooting

On macOS, installed here as a symlink pointing to the `.js` file in the repo:

```
/opt/homebrew/bin/acm
```

If you get permissions issues, it is because the `.js` file was rebuilt and with standard permissions and needs to be linked again.

```sh
$ npm run cli
```

Check:

```sh
ls -l $(realpath /opt/homebrew/bin/acm)
```

See [package.json](/package.json).

Supposedly you should be able to leave out the project name when running `npm link` via an `npm run ...` command but I found this causes issues, so decided to always use the full name in the configuration. But removed it later . And to _always_ unlink then link in one go because of permissions issues.
