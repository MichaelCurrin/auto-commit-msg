/**
 * Autofill module.
 */
import * as vscode from "vscode";
import { Repository } from "./api/git";
import { getChanges } from "./git/cli";
import { getCommitMsg, setCommitMsg } from "./gitExtension";
import { generateMsg } from "./prepareCommitMsg";

export const NO_LINES_MSG = `\
Unable to generate message as no changes files can be seen.
Try saving your files or stage any new (untracked) files.\
`;

/**
 * Generate and fill a commit message in the Git extension sidebar.
 *
 * Steps:
 *
 *   1. Read Git command output and the message in the Git Extension commit message box.
 *   2. Generate a message.
 *   3. Push message value to the commit message box.
 *
 * This is based on `prefixCommit` from the `git-prefix` extension.
 */
export async function makeAndFillCommitMsg(repository: Repository) {
  const fileChanges = await getChanges(repository);

  console.debug("diff-index:", fileChanges);

  if (!fileChanges.length) {
    vscode.window.showErrorMessage(NO_LINES_MSG);
    return;
  }

  const oldMsg = getCommitMsg(repository);
  console.debug("Old message: ", oldMsg);

  const newMsg = generateMsg(fileChanges, oldMsg);
  console.debug("New message: ", newMsg);

  setCommitMsg(repository, newMsg);
}
