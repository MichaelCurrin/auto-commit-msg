/**
 * Autofill module.
 */
import * as vscode from "vscode";
import { Repository } from "./api/git";
import { getChanges } from "./git/cli";
import { getCommitTemplateValue } from "./git/commitTemplate";
import { getCommitMsg, setCommitMsg } from "./gitExtension";
import { generateMsg } from "./prepareCommitMsg";

export const NO_LINES_MSG = `\
Unable to generate message as no changes files can be seen.
Try saving your files or stage any new (untracked) files.\
`;

/**
 * Generate and fill a commit message in the Git extenside sidebar.
 *
 * Steps:
 *
 *   1. Read git command output and the message in the Git Extension commit message box.
 *   2. Generate a message.
 *   3. Push message value to the commit message box.
 *
 * New functionality in the extension - the commit message file is read
 * explicitly and the content used. Any content in the Git pane that was the
 * "old message" is ignored then.
 *
 * This function is based on `prefixCommit` from the `git-prefix` extension.
 */
export async function makeAndFillCommitMsg(repository: Repository) {
  const fileChanges = await getChanges();

  console.debug("diff-index:", fileChanges);

  if (!fileChanges.length) {
    vscode.window.showErrorMessage(NO_LINES_MSG);
    return;
  }

  const oldMsg = getCommitMsg(repository);
  console.debug("Old message: ", oldMsg);

  const newMsg = generateMsg(fileChanges, oldMsg);
  console.debug("New message: ", newMsg);

  const commitMessageValue = await getCommitTemplateValue();
  console.debug({ commitMessageValue });

  setCommitMsg(repository, newMsg);
}
