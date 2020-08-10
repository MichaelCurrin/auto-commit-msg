import util = require('util');
import childProcess = require('child_process');

import { getWorkspaceFolder } from './workspace';

const exec = util.promisify(childProcess.exec);

export class Git {
  static execute(cwd: string, command?: string, options: string[] = []) {
    return exec(`git ${command} ${options.join(' ')}`, { cwd });
  }

  // TODO: This can be removed if not used.
  static async status(options: string[] = []) {
    return this.execute(getWorkspaceFolder(), 'status', [
      '-s',
      '-uno',
      '--porcelain',
      ...options
    ]);
  }

  /** 
   * Run git diff-index with flags.
   * 
   * If the CLI command was an empty string (no changes), then the result would be `[ '' ]`,
   * so return empty array instead.
   */
  private static async diffIndex(
    options: string[] = []
  ): Promise<Array<string>> {
    const {
      stdout,
      stderr
    } = await this.execute(getWorkspaceFolder(), 'diff-index', [
      '--name-status',
      ...options,
      'HEAD'
    ]);

    if (stderr) {
      console.debug('stderror for git diff-index command:', stderr);
    }

    if (stdout.length === 0) {
      return [];
    }
    return stdout.split('\n');
  }

  /** Summary of diff for staged and unstaged files, excluding untracked. **/
  static async allChanges() {
    return this.diffIndex();
  }

  /** Summary of diff for staged files, excluding untracked. **/
  static async stagedChanges() {
    return this.diffIndex([ '--cached' ]);
  }

  /** Look for diff of staged files otherwise fall back to all files. Always excludes untracked */
  static async getChanges() {
    const staged = await this.stagedChanges();

    if (staged.length === 0) {
      console.debug('No staged changes found, using unstaged');
      return this.allChanges();
    }

    console.debug('Found staged changes');
    return staged;
  }
}
