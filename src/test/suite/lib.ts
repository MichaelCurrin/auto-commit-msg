import * as fs from 'fs';
import * as path from 'path';
const fsExtra = require('fs-extra');

import { Git } from '../../git';

function generateRandomName() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 10);
}

export async function createFile(directoryPath: string, content = '', extension = 'txt') {
  const filePath = path.join(directoryPath, `${generateRandomName()}.${extension}`);

  fs.writeFileSync(filePath, content);

  return filePath;
}

export async function getLastMessage(directoryPath: string) {
  return await Git.execute(directoryPath, 'log', ['-1', '--pretty=%B']);
}

export async function clearDirectory(directoryPath: string) {
  return fsExtra.emptyDir(directoryPath);
}
