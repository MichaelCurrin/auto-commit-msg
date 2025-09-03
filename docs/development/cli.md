# CLI Development

The code is in [src/cli/](/src/cli).

The CLI commands are built using steps set in [package.json](/package.json) - see the `cli` command and `bin` section.

## Package as a binary

```sh
$ npx --yes pkg out/cli/diffIndexGenerateCommit.js -t node18-macos
```

## Troubleshooting

If you get permissions issues, remove and add again.

```sh
$ npm unlink auto-commit-msg
$ npm link auto-commit-msg
```
