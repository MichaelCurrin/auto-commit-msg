import * as path from "path";

import * as glob from "glob";
import { runTests } from "@vscode/test-electron";

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");

    // The path to the extension test script
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, "./suite/index");

    const vscodePaths = glob.sync(
      `${extensionDevelopmentPath}/.vscode-test/vscode-*/code`
    );

    if (vscodePaths.length == 0) {
      throw new Error("Unable to find vscode executable");
    }

    const vscodeExecutablePath = vscodePaths[0];

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      vscodeExecutablePath,
    });
  } catch (err) {
    console.error("Failed to run tests\n" + err);
    process.exit(1);
  }
}

main();
