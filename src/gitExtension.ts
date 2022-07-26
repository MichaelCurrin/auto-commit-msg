/**
 * Git extension module.
 *
 * Perform tasks related to the built-in Git extension.
 *
 * This module takes care of the high-level flow of the extension, after a repo
 * is selected in extension.ts module.
 *
 * This module handles reading Git output, processes it with the logic in the
 * generate module and then finally sets it in the UI message box.
 */
import * as vscode from "vscode";
import { GitExtension, Repository } from "./api/git";

/**
 * Fetch the commit message in the Git Extension.
 */
export function getCommitMsg(repository: Repository): string {
  return repository.inputBox.value;
}

/**
 * Set the commit message in the Git Extension pane's input.
 */
export function setCommitMsg(repository: Repository, msg: string) {
  repository.inputBox.value = msg;
}

/**
 * Return VS Code's built-in Git extension.
 */
export function getGitExtension() {
  const vscodeGit = vscode.extensions.getExtension<GitExtension>("vscode.git");
  const gitExtension = vscodeGit && vscodeGit.exports;

  return gitExtension && gitExtension.getAPI(1);
}
