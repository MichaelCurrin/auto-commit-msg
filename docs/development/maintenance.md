# Maintenance ntoes

When upgrading `@types/vscode` in [package.json](/package.json), you need to also upgrade the `engines.vscode` value or you'll get an error when packaging the extension. Running the `test` command will not tell you about the error.
