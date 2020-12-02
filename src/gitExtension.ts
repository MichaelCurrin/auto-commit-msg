/**
 * Git extension module.
 *
 * Perform tasks related to the builtin Git extension.
 */
import { Repository } from './api/git';

/**
 * Fetch the commit message in the Git Extension.
 *
 * This could useful when doing semantic commits, as the initial 'feat' or 'feat: ' portion
 * or similar can be kept as a prefix while the generated message added on.
 * Or if left out, it can be generated if possible such as for 'chore' or 'docs'.
 */
export function getCommitMsg(repository: Repository): string {
  return repository.inputBox.value;
}

/**
 * Set the commit message in the Git Extension.
 */
export function setCommitMsg(repository: Repository, msg: string) {
  repository.inputBox.value = msg;
}
