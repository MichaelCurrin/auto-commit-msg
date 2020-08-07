import * as assert from "assert";
import * as vscode from "vscode";

import { createFile, clearDirectory, getLastMessage } from "./common";

suite("Extension Test Suite", () => {
  const { workspaceFolders } = vscode.workspace;
  const directoryPath = workspaceFolders ? workspaceFolders[0].uri.fsPath : "";

  suiteTeardown(() => clearDirectory(directoryPath));

  test('should commit with "build" type', async () => {
    const sampleSubject = "add new file";
    const expectedMessage = `build: ${sampleSubject}`;

    await createFile(directoryPath, "Hello World");
    await vscode.env.clipboard.writeText(sampleSubject);
    await vscode.commands.executeCommand("gitSemanticCommit.semanticCommit");
    await vscode.commands.executeCommand("editor.action.clipboardPasteAction");
    await vscode.commands.executeCommand(
      "workbench.action.quickOpenSelectNext"
    );
    await vscode.commands.executeCommand(
      "workbench.action.acceptSelectedQuickOpenItem"
    );
    await new Promise(resolve => setTimeout(resolve, 3000));
    const { stdout: message } = await getLastMessage(directoryPath);

    assert.equal(message.includes(expectedMessage), true);
  });

  test('should commit with a scope and "build" type', async () => {
    const sampleScope = "scope";
    const sampleSubject = "add new file";
    const expectedMessage = `build(${sampleScope}): ${sampleSubject}`;

    await createFile(directoryPath, "Hello World");
    await vscode.env.clipboard.writeText(sampleScope);
    await vscode.commands.executeCommand("gitSemanticCommit.semanticCommit");
    await vscode.commands.executeCommand("editor.action.clipboardPasteAction");
    await vscode.commands.executeCommand(
      "workbench.action.acceptSelectedQuickOpenItem"
    );
    await vscode.env.clipboard.writeText(sampleSubject);
    await vscode.commands.executeCommand("editor.action.clipboardPasteAction");
    await vscode.commands.executeCommand(
      "workbench.action.quickOpenSelectNext"
    );
    await vscode.commands.executeCommand(
      "workbench.action.acceptSelectedQuickOpenItem"
    );
    await new Promise(resolve => setTimeout(resolve, 3000));
    const { stdout: message } = await getLastMessage(directoryPath);

    assert.equal(message.includes(expectedMessage), true);
  });
});
