# Debugging
> How to deal with errors in the extension

## Test shell commands

This snippet of code can be used to for testing that a basic command works without error and output can be shown.

```typescript
/**
 * Debug tool for checking that a basic command works.
 * Replace the `makeAndFillCommitMsg` call with `test` to use this.
 */
async function _test(repository: Repository) {
  vscode.window.showInformationMessage("Testing")

  let cwd = repository.rootUri.path;

  vscode.window.showInformationMessage(cwd)

  const resp = await _execute(cwd, 'git --version')
  vscode.window.showInformationMessage(`${resp.stdout} -- ${resp.stderr}`)
}
```

### Background

This was prompted by issue [#93](https://github.com/MichaelCurrin/auto-commit-msg/issues/93) on Windows.

The output in the debug mode did not work because the shell command failed to spawn at all using `exec()` in Node. 

I printed the `cwd` value in the VS Code info box using code above. I realized that when it was used with `git` in `cmd` on Windows that the path was not valid. Showing as `/c:/...` with a leading forward-slash appropriate for Linux/macOS but not Windows `cmd`.

This is the temporary hack until the `vscode` library has a fix:

```typescript
cwd = cwd.replace("/c:/", "c:/")
```