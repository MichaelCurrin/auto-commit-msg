import util = require('util');
import childProcess = require('child_process');

import { getWorkspaceFolder } from './workspace';

const exec = util.promisify(childProcess.exec);

export class Git {
  static execute(cwd: string, command?: string, options: string[] = []) {
    return exec(`git ${command} ${options.join(' ')}`, { cwd });
  }

  static async status(options: string[] = []) {
    return this.execute(getWorkspaceFolder(), 'status', [
      '-s',
      '-uno',
      '--porcelain',
      ...options
    ]);
  }
}
