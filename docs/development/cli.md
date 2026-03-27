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

See [package.json](/package.json). Supposedly you should be able to leave out the project name when running `npm link` via an `npm run ...` command but I found this causes issues, so decided to always use the full name in the configuration. And to _always_ unlink then link in one go because of permissions issues.
