import { commands, window, Disposable, ExtensionContext } from 'vscode';

import { extensionIdentifier } from '../constants';
import { SemanticCommitCommand } from './semantic-commit';

const commandDefinitions = [SemanticCommitCommand];

const createDisposables = (context: ExtensionContext): Disposable[] => {
  return commandDefinitions.map(CommandDefinition => {
    const command = new CommandDefinition(context);

    return commands.registerCommand(`${extensionIdentifier}.${command.identifier}`, async () => {
      try {
        await command.execute();
      } catch ({ message }) {
        window.showErrorMessage(message);
      }
    });
  });
};

const registerCommands = async (context: ExtensionContext) => {
  context.subscriptions.push(...createDisposables(context));
};

export { registerCommands };
