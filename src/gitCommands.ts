/**
 * Git commands.
 *
 * This module is not named git.ts, in order to keep it distinct from the VS Code Git extension
 * module of the same name and for which there are types under src/api/git.d.ts .
 *
 * There should be be confusion in the Git class here matching the name of one in the VS Code
 * module, since that is not directly used in this project.
 */
import util = require('util');
import childProcess = require('child_process');

import { getWorkspaceFolder } from './workspace';

const exec = util.promisify(childProcess.exec);

export class Git {
  /** Run git CLI command and return output. **/
  static execute(cwd: string, command?: string, options: string[] = []) {
    return exec(`git ${command} ${options.join(' ')}`, { cwd });
  }

  /**
   * Run git diff-index with flags and return output.
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

    return stdout.split('\n').filter(line => line !== '');
  }

  /** Summary of diff for staged and unstaged files, excluding untracked. **/
  static async allChanges() {
    return this.diffIndex();
  }

  /** Summary of diff for staged files, excluding untracked. **/
  static async stagedChanges() {
    return this.diffIndex([
      '--cached'
    ]);
  }

  /**
   * List files changed and how they changed.
   *
   * Look for diff description of staged files, otherwise fall back to all files. This is a wrapper
   * on `stagedChanges` or `allChanges`. Always excludes untracked files - make sure to stage a file
   * so it becomes tracked, especially in the case of a rename.
   *
   * Returns using the type of the underlying `diffIndex` function.
   */
  static async getChanges() {
    const staged = await this.stagedChanges();

    if (staged.length) {
      console.debug('Found staged changes');
      return staged;
    }
    else {
      console.debug('Staging area is empty. Using unstaged files.');

      const unstaged = await this.allChanges();
      if (!unstaged.length) {
        console.debug('Could not find any changed files');
      }
      return unstaged;
    }
  }

  /**
   * Run git status short and return output.
   *
   * Ignore untracked and remove color.
   *
   * This was used before diffIndex was introduced to this project, so this function might not be
   * needed.
   */
  static async status(options: string[] = []) {
    return this.execute(getWorkspaceFolder(), 'status', [
      '--short',
      '-uno',
      '--porcelain',
      ...options
    ]);
  }
}
