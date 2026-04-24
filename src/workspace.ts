import { workspace } from "vscode";

/**
 * Get the root folder path of the current workspace.
 *
 * @returns The file system path of the first workspace folder, or an empty
 *   string if no workspace folders are open.
 */
export function getWorkspaceFolder(): string {
  const { workspaceFolders } = workspace;

  return workspaceFolders ? workspaceFolders[0].uri.fsPath : "";
}
