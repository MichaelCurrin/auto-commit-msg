import { workspace } from "vscode";

export function getWorkspaceFolder(): string {
  const { workspaceFolders } = workspace;

  return workspaceFolders ? workspaceFolders[0].uri.fsPath : "";
}
