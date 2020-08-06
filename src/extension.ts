import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Started "autoCommitMsg"');

	const disposable = vscode.commands.registerCommand('extension.autoCommitMsg', () => {
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}
