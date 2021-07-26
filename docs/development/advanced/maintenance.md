# Maintenance

## Dependencies

When upgrading `@types/vscode` in [package.json](/package.json), you must also upgrade the `engines.vscode` value manually.

Or you'll get an error when packaging the extension, like:

```
ERROR  @types/vscode ^1.53.0 greater than engines.vscode ^1.52.0. Consider upgrade engines.vscode or use an older @types/vscode version
```

Running the `test` command will not tell you about the error.


## Images

The extension icon listed in `package.json` must not be an SVG because of security limitations by VS Code. A PNG works fine.

SVGs are used for "commands" though, for the extension's button.

See [images](/images/).
