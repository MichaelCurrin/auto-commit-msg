# CLI Development

The code is in [src/bin/](/src/bin).

The CLI commands are built using steps set in [package.json](/package.json) - see the `cli` scripts and `bin` section.

## Package as a binary

```sh
$ npx --yes pkg out/bin/diffIndexGenerateCommit.js -t node18-macos
```

## Troubleshooting

If you get permissions issues, remove and add again.

```sh
$ npm unlink auto-commit-msg
$ npm link auto-commit-msg
```
