# CLI Development
> Maintaining code around the CLI tool

The code is in [src/cli/](/src/cli). The CLI commands are built using steps set in [package.json](/package.json) - see the `cli` command and `bin` section.



## Run directly

```sh
$ npx ts-node src/cli/diffIndexGenerate.ts
```


## Package as a binary

To send to someone so they can use it without having Node installed or running a build step on their machine.

```sh
$ npx --yes pkg out/cli/diffIndexGenerateCommit.js -t node18-macos
```

## Troubleshooting

On macOS, installed here:

```
/opt/homebrew/bin/acm
```

If you get permissions issues, remove and add again.

```sh
$ npm unlink auto-commit-msg
$ npm link auto-commit-msg
```

See [package.json](/package.json). Supposedly you should be able to leave out the project name when running `npm link` via an `npm run ...` command but I found this causes issues, so decided to always use the full name in the configuration. And to always unlink then link in one go.
