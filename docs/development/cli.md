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

If you get permissions issues, remove and add again.

```sh
$ npm unlink auto-commit-msg
$ npm link auto-commit-msg
```
