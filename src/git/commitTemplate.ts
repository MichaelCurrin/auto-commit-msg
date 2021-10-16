/**
 * Commit template module.
 *
 * TODO: Move to docs and link there.
 *
 * Read the message from the a configured commit template file and use it as a
 * prefix in the message.
 *
 * A commit template is built-in Git behavior to see a value for the start of
 * each commit message. This is useful if you have a ticket number, project
 * name, or similar to add at the start of each commit.
 *
 * Note that VS Code and Git CLI both automatically read from this file when
 * generating a commit. However, the value is hard to use. There is behavior in
 * this extension to move the old message to the end and enter a commit type
 * prefix and commit message before it, but there is no way to know from the
 * content of the message for sure whether the old message is a commit template
 * value or just a hand-typed message.
 *
 * To avoid making an extra config value for the extension that one has to
 * manage say in a Settings file or internal data, the approach is rather to use
 * the existing commit template pattern in Git.
 */
import * as fs from "fs";
import * as path from "path";
import { getWorkspaceFolder } from "../workspace";
import { execute } from "./cli";

const CONFIG_SUBCOMMAND = "config";
const COMMIT_TEMPLATE_IDENTIFIER = "commit.template";

/**
 * Get a value from the local Git config.
 */
export async function _getConfigValue(options: string[]) {
  const workspace = getWorkspaceFolder();

  const { stdout, stderr } = await execute(
    workspace,
    CONFIG_SUBCOMMAND,
    options
  );

  if (stderr) {
    console.debug(`stderr for 'git ${CONFIG_SUBCOMMAND}' command:`, stderr);
  }

  return stdout;
}

/**
 * Get commit template path.
 *
 * Get the configured value for a commit template path if set.
 */
async function _getCommitTemplatePath() {
  try {
    const options = [COMMIT_TEMPLATE_IDENTIFIER];

    return await _getConfigValue(options);
  } catch (_e) {
    console.error(_e)

    return null;
  }
}

/**
 * Read a file.
 *
 * @param filePath Path to a file to read, relative to the workspace root.
 *   e.g. "abc.txt" or "abc/def.txt"
 */
function _readFile(filePath: string) {
  const workspace = getWorkspaceFolder();
  const p = path.join(workspace, filePath);

  let value;

  try {
    value = fs.readFileSync(p, "utf-8");
  } catch (err: any) {
    console.error(`Could not find template file: ${p}. ${err.toString()}`);

    return null;
  }

  if (!value) {
    return null;
  }

  console.debug(`Found file: ${p}. Found contents: ${value}`);

  return value;
}

/**
 * Get value of commit template file.
 *
 * @return Contents of a configured commit message template file, or `null` if
 *   file is not configured or file is missing.
 */
export async function getCommitTemplateValue() {
  const filePath = await _getCommitTemplatePath();

  if (!filePath) {
    console.error(`Could not read missing file: ${filePath}`);

    return null;
  }

  return _readFile(filePath);
}
