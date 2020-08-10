import util = require('util');
import childProcess = require('child_process');

import { getWorkspaceFolder } from './workspace';

const exec = util.promisify(childProcess.exec);

export class Git {
  /** Run git CLI command. **/
  static execute(cwd: string, command?: string, options: string[] = []) {
    return exec(`git ${command} ${options.join(' ')}`, { cwd });
  }

  /** 
   * Get machine-readable value for git status short output.
   * 
   * This could be removed if not used.
   */
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
   * Remove any empty lines, whether because of no changes or just the way the command-line
   * data comes in or is split.
   * 
   * Note the output already seems always to have no color from my testing, but the 
   * no color flagged is added to be safe.
   */
  private static async diffIndex(options: string[] = []): Promise<Array<string>> {
    const { stdout, stderr } = await this.execute(getWorkspaceFolder(), 'diff-index', [
      '--name-status',
      '--find-renames',
      '--find-copies',
      '--no-color',
      ...options,
      'HEAD'
    ]);

    if (stderr) {
      console.debug('stderror for git diff-index command:', stderr);
    }

    return stdout.split('\n').filter((line) => line !== '');
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
