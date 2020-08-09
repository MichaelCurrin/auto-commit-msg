import * as vscode from 'vscode';

import { registerCommands } from './commands';

export async function activate(context: vscode.ExtensionContext) {
  registerCommands(context);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
