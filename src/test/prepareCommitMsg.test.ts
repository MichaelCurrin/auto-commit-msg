/**
 * Prepare commit message test module.
 *
 * Check creation of commit message.
 */
import * as assert from "assert";
import { CONVENTIONAL_TYPE } from "../lib/constants";
import { generateMsgFromChanges } from "../prepareCommitMsg";

describe("Prepare commit message", function () {
  describe("#generateMsgFromChanges()", function () {
    it("handles a single file correctly", function () {
      const expected = {
        prefix: CONVENTIONAL_TYPE.FEAT,
        fileChangeMsg: "Create baz.txt",
      };

      assert.deepStrictEqual(
        generateMsgFromChanges(["A    baz.txt"]), expected);
    });

    it("handles 2 files with the same action correctly", function () {
      const expected = {
        prefix: CONVENTIONAL_TYPE.UNKNOWN,
        fileChangeMsg: "Create baz.txt and bar.js",
      };

      assert.deepStrictEqual(
        generateMsgFromChanges(["A    baz.txt", "A    bar.js"]), expected);
    });

    it("handles 2 files with a different action correctly", function () {
      const expected = {
        prefix: CONVENTIONAL_TYPE.UNKNOWN,
        fileChangeMsg: "Various changes to baz.txt and bar.js",
      };

      assert.deepStrictEqual(
        generateMsgFromChanges(["A    baz.txt", "M    bar.js"]), expected);
    });
  });
});
