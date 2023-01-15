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

  let cwd = repository.rootUri.fsPath;

  vscode.window.showInformationMessage(cwd)

  const resp = await _execute(cwd, 'git --version')
  vscode.window.showInformationMessage(`${resp.stdout} -- ${resp.stderr}`)
}
```

### Background

This was prompted by issue [#93](https://github.com/MichaelCurrin/auto-commit-msg/issues/93) on Windows.

The output in the debug mode did not work because the shell command failed to spawn at all using `exec()` in Node. 

The `cwd` value was incorrect from the existing logs which I didn't notice initially but using the test above made it clear. 