import { workspace } from 'vscode';

const getWorkspaceFolder = (): string => {
  const { workspaceFolders } = workspace;
  return workspaceFolders ? workspaceFolders[0].uri.fsPath : '';
};

export { getWorkspaceFolder };
