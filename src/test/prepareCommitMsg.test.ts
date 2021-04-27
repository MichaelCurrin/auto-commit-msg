/**
 * Prepare commit message test module.
 *
 * Check creation of commit message.
 */
import * as assert from "assert";
import { CONVENTIONAL_TYPE } from "../lib/constants";
import { _msgFromChanges } from "../prepareCommitMsg";

describe("Prepare commit message", function () {
  describe("#_msgFromChanges", function () {
    it("handles a single file correctly", function () {
      const expected = {
        prefix: CONVENTIONAL_TYPE.FEAT,
        fileChangeMsg: "Create baz.txt",
      };

      assert.deepStrictEqual(
        _msgFromChanges(["A    baz.txt"]), expected);
    });

    describe("multiple files with the same action", function () {
      it("handles 2 created files created correctly", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.FEAT,
          fileChangeMsg: "Create baz.txt and bar.js",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["A    baz.txt", "A    bar.js"]), expected);
      });

      it("handles 2 modified files correctly", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.UNKNOWN,
          fileChangeMsg: "Update baz.txt and bar.js",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["M    baz.txt", "M    bar.js"]), expected);
      });

      it("handles 3 files with the same action correctly", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.FEAT,
          fileChangeMsg: "Create baz.txt, bar.js and fuzz.md",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["A    baz.txt", "A    bar.js", "A    fizz/fuzz.md"]), expected);
      });

      it("handles 4 files with the same action correctly", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.FEAT,
          fileChangeMsg: "Create baz.txt, bar.js, fuzz.md and fuzz.ts",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["A    baz.txt", "A    bar.js", "A    fuzz.md", "A    fuzz.ts"]),
          expected);
      });

      it("handles 3 files in subdirectories but does not show the directory paths", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.FEAT,
          fileChangeMsg: "Create baz.txt, bar.js and fuzz.md",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["A    baz.txt", "A    fizz/bar.js", "A    fizz/fuzz.md"]),
          expected);
      });

      it("handles 2 \"build\" files correctly", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.BUILD,
          fileChangeMsg: "Update package.json and package-lock.json",
        };

        assert.deepStrictEqual(
          _msgFromChanges(
            ["M    package.json", "M     package-lock.json"]
          ),
          expected);
      });

      it("handles 3 README.md files in different locations as full paths", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.DOCS,
          fileChangeMsg: "Update docs/README.md, bar/README.md and README.md",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["M    docs/README.md", "M    bar/README.md", "M    README.md"]),
          expected);
      });
    });

    describe("multiple files with the same action", function () {
      it("handles 2 files - one created and one modified", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.UNKNOWN,
          fileChangeMsg: "Various changes to baz.txt and bar.js",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["A    baz.txt", "M    bar.js"]), expected);
      });

      it("handles 3 files - with different actions", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.UNKNOWN,
          fileChangeMsg: "Various changes to baz.txt, bar.js and README.md",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["A    baz.txt", "M    bar.js", "D    README.md"]), expected);
      });
    });
  });
});
