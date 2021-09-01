import { workspace } from "vscode";

export function getWorkspaceFolder(): string {
  const { workspaceFolders } = workspace;
  console.log({ workspaceFolders });

  return workspaceFolders ? workspaceFolders[0].uri.fsPath : "";
}
