/**
 * Prepare commit message test module.
 *
 * Check creation of commit message.
 */
import * as assert from "assert";
import { generateMsgFromChanges } from "../prepareCommitMsg";

describe("Prepare commit message", function () {
  describe("#generateMsgFromChanges()", function () {
    it("splits a path correctly", function () {
      const expected = {
        prefix: "feat",
        fileChangeMsg: "Create baz.txt",
      };

      assert.deepStrictEqual(
        generateMsgFromChanges(["A    baz.txt"]), expected);
    });
  });
});
