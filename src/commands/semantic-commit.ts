import { window, workspace, ExtensionContext, QuickPickItem } from 'vscode';

import { getConfiguration, ConfigurationProperties } from '../config';
import { Git } from '../git';
import { workspaceStorageKey, scopeTemplatePlaceholder } from '../constants';
import { Command } from './common';

const enum ActionType {
  scope = 'scope',
  subject = 'subject'
}

const scopeStorageKey = `${workspaceStorageKey}:scope`;

export class SemanticCommitCommand extends Command {
  identifier = 'semanticCommit';

  context: ExtensionContext;
  scope: string;
  types: (string | {type: string, description: string})[];

  constructor(context: ExtensionContext) {
    super();

    this.context = context;
    this.scope = this.getScope();
    this.types = this.getTypes();

    workspace.onDidChangeConfiguration(() => {
      this.scope = this.getScope();
      this.types = this.getTypes();
    });
  }

  async execute() {
    await Git.exists();

    const quickPick = this.createQuickPick(this.createQuickPickItems());

    quickPick.show();

    quickPick.onDidHide(() => {
      if (!this.isPreserveScopeEnabled()) {
        this.scope = '';
      }
    });

    quickPick.onDidChangeSelection(async (items: any) => {
      if (items.length > 0) {
        const [{ actionType }] = items;

        if (actionType === ActionType.scope) {
          this.scope = quickPick.value;
          this.context.workspaceState.update(scopeStorageKey, this.scope);

          quickPick.value = '';
          quickPick.items = this.createQuickPickItems();
        } else {
          const [{ type }] = items;
          const subject = quickPick.value;

          await this.performCommit(type, subject);

          quickPick.hide();
        }
      }
    });
  }

  private isPreserveScopeEnabled() {
    return getConfiguration()[ConfigurationProperties.preserveScope];
  }

  private isStageAllEnabled() {
    return getConfiguration()[ConfigurationProperties.stageAll];
  }

  private get scopeTemplate() {
    const template = getConfiguration()[ConfigurationProperties.scopeTemplate];
    return template.length ? template : scopeTemplatePlaceholder;
  }

  private hasScope() {
    return this.scope.length > 0;
  }

  private getScope() {
    return this.isPreserveScopeEnabled()
      ? this.context.workspaceState.get(scopeStorageKey, '')
      : '';
  }

  private getTypes() {
    return [...getConfiguration()[ConfigurationProperties.types].sort()];
  }

  private getCommitOptions() {
    return getConfiguration()[ConfigurationProperties.commitOptions].split(' ');
  }

  private createQuickPick(items: QuickPickItem[]) {
    const quickPick = window.createQuickPick();

    quickPick.items = [...items];
    quickPick.placeholder = 'Type a value (scope or subject)';
    quickPick.ignoreFocusOut = true;

    return quickPick;
  }

  private createQuickPickItems(): QuickPickItem[] {
    const hasScope = this.hasScope();
    const typeItems = this.types.map(item => {
        const description = typeof item === "string" ? "" : item.description
        const type = typeof item === "string" ? item : item.type
        return ({
          label: `$(git-commit) Commit with "${type}" type`,
          alwaysShow: true,
          actionType: ActionType.subject,
          type,
          description
        })
    });

    return [
      {
        label: hasScope
          ? `$(gist-new) Change the message scope`
          : `$(gist-new) Add a message scope`,
        alwaysShow: true,
        actionType: ActionType.scope,
        type: '',
        description: hasScope ? `current: "${this.scope}"` : ''
      },
      ...typeItems
    ];
  }

  private async performCommit(type: string, subject: string) {
    if (subject.length > 0) {
      const scope = this.hasScope()
        ? this.scopeTemplate.replace(scopeTemplatePlaceholder, this.scope)
        : '';
      const message = `${type}${scope}: ${subject}`;

      if (this.isStageAllEnabled()) {
        try {
          await Git.add();
        } catch ({ message }) {
          window.showErrorMessage(message);
        }
      }

      try {
        await Git.commit(message, this.getCommitOptions());
      } catch ({ message }) {
        window.showErrorMessage(message);
      }
    } else {
      window.showErrorMessage('The message subject cannot be empty!');
    }
  }
}
