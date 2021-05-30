/**
 * Prepare commit message test module.
 *
 * Check creation of commit message.
 */
import * as assert from "assert";
import { CONVENTIONAL_TYPE } from "../lib/constants";
import {
  _combineOldAndNew,
  _formatMsg,
  _msgFromChanges,
  _newMsg,
} from "../prepareCommitMsg";

describe("Prepare commit message", function () {
  describe("#_msgFromChanges", function () {
    it("handles a single file correctly", function () {
      const expected = {
        prefix: CONVENTIONAL_TYPE.FEAT,
        fileChangeMsg: "Create baz.txt",
      };

      assert.deepStrictEqual(_msgFromChanges(["A    baz.txt"]), expected);
    });

    describe("multiple files with the same action", function () {
      it("handles 2 created files created correctly", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.FEAT,
          fileChangeMsg: "Create baz.txt and bar.js",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["A    baz.txt", "A    bar.js"]),
          expected
        );
      });

      it("handles 2 modified files correctly", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.UNKNOWN,
          fileChangeMsg: "Update baz.txt and bar.js",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["M    baz.txt", "M    bar.js"]),
          expected
        );
      });

      it("handles 3 files with the same action correctly", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.FEAT,
          fileChangeMsg: "Create baz.txt, bar.js and fuzz.md",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["A    baz.txt", "A    bar.js", "A    fizz/fuzz.md"]),
          expected
        );
      });

      it("handles 4 files with the same action correctly", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.FEAT,
          fileChangeMsg: "Create baz.txt, bar.js, fuzz.md and fuzz.ts",
        };

        assert.deepStrictEqual(
          _msgFromChanges([
            "A    baz.txt",
            "A    bar.js",
            "A    fuzz.md",
            "A    fuzz.ts",
          ]),
          expected
        );
      });

      it("handles 3 files in subdirectories but does not show the directory paths", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.FEAT,
          fileChangeMsg: "Create baz.txt, bar.js and fuzz.md",
        };

        assert.deepStrictEqual(
          _msgFromChanges([
            "A    baz.txt",
            "A    fizz/bar.js",
            "A    fizz/fuzz.md",
          ]),
          expected
        );
      });

      /* eslint-disable-next-line quotes */
      it('handles 2 "build(deps)" files correctly', function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.BUILD_DEPENDENCIES,
          fileChangeMsg: "Update package.json and package-lock.json",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["M    package.json", "M     package-lock.json"]),
          expected
        );
      });

      it("handles 3 README.md files in different locations as full paths", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.DOCS,
          fileChangeMsg: "Update docs/README.md, bar/README.md and README.md",
        };

        assert.deepStrictEqual(
          _msgFromChanges([
            "M    docs/README.md",
            "M    bar/README.md",
            "M    README.md",
          ]),
          expected
        );
      });
    });

    describe("multiple files with the same action", function () {
      it("handles 2 files - one created and one modified", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.UNKNOWN,
          fileChangeMsg: "Various changes to baz.txt and bar.js",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["A    baz.txt", "M    bar.js"]),
          expected
        );
      });

      it("handles 3 files - with different actions", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.UNKNOWN,
          fileChangeMsg: "Various changes to baz.txt, bar.js and README.md",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["A    baz.txt", "M    bar.js", "D    README.md"]),
          expected
        );
      });
    });
  });

  describe("#_formatMsg", function () {
    it("combines a prefix and message correctly", function () {
      assert.strictEqual(
        _formatMsg(CONVENTIONAL_TYPE.FEAT, "Create foo.txt"),
        "feat: Create foo.txt"
      );

      assert.strictEqual(
        _formatMsg(CONVENTIONAL_TYPE.BUILD, "Update foo.txt"),
        "build: Update foo.txt"
      );

      assert.strictEqual(
        _formatMsg(CONVENTIONAL_TYPE.DOCS, "Update README.md"),
        "docs: Update README.md"
      );
    });
  });

  describe("#_newMsg", function () {
    describe("creates a new message from a prefix and message", function () {
      it("handles a single change", function () {
        assert.strictEqual(_newMsg(["A    baz.txt"]), "feat: Create baz.txt");
      });

      it("handles multiple changes", function () {
        // Leave the detailed cases to tests for _msgFromChanges.

        assert.strictEqual(
          _newMsg(["A    baz.txt", "A    bar.js"]),
          "feat: Create baz.txt and bar.js"
        );

        assert.strictEqual(
          _newMsg(["A    baz.txt", "A    bar.js", "A    fizz/fuzz.md"]),
          "feat: Create baz.txt, bar.js and fuzz.md"
        );

        assert.strictEqual(
          _newMsg([
            "M    docs/README.md",
            "M    bar/README.md",
            "M    README.md",
          ]),
          "docs: Update docs/README.md, bar/README.md and README.md"
        );
      });
    });
  });

  describe("#_combineOldAndNew", function () {
    it("combines uses the new message if there is no old message", function () {
      assert.strictEqual(
        _combineOldAndNew(CONVENTIONAL_TYPE.FEAT, "Foo bar"),
        "feat: Foo bar"
      );

      assert.strictEqual(
        _combineOldAndNew(CONVENTIONAL_TYPE.FEAT, "Foo bar", ""),
        "feat: Foo bar"
      );
    });

    it("combines an existing message and a new message", function () {
      // Typical case is '[JIRA_TICKET] docs:' has 'Update foo' added.
      // Though this ends up duplicating docs and feat possible.
      // This isn't so smart yet but helps sometimes.

      assert.strictEqual(
        _combineOldAndNew(CONVENTIONAL_TYPE.UNKNOWN, "Foo bar", "Fizz buzz"),
        "Fizz buzz Foo bar"
      );

      assert.strictEqual(
        _combineOldAndNew(CONVENTIONAL_TYPE.UNKNOWN, "Foo bar", "feat:"),
        "feat: Foo bar"
      );
      assert.strictEqual(
        _combineOldAndNew(CONVENTIONAL_TYPE.UNKNOWN, "Foo bar", "feat: "),
        "feat: Foo bar"
      );

      // This isn't intended but currently how it works.
      assert.strictEqual(
        _combineOldAndNew(CONVENTIONAL_TYPE.FEAT, "Foo bar", "Fizz buzz"),
        "Fizz buzz feat: Foo bar"
      );
    });
  });
});
