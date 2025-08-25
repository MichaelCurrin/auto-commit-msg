/**
 * Paths test module.
 *
 * Test handling of path values as text.
 */
import * as assert from "assert";
import { ROOT } from "../../lib/constants";
import {
  _join,
  friendlyFile,
  humanList,
  quoteForSpaces,
  splitPath,
} from "../../lib/paths";

describe("Path handling", function () {
  describe("#splitPath", function () {
    it("splits a path correctly", function () {
      assert.deepStrictEqual(splitPath("baz.txt"), {
        atRoot: true,
        dirPath: ROOT,
        name: "baz.txt",
        extension: ".txt",
      });

      assert.deepStrictEqual(splitPath("foo/bar/baz.txt"), {
        atRoot: false,
        dirPath: "foo/bar",
        name: "baz.txt",
        extension: ".txt",
      });
    });

    it("handles file at root level", function () {
      const result = splitPath("foo.txt");
      assert.strictEqual(result.atRoot, true);
      assert.strictEqual(result.dirPath, ROOT);
      assert.strictEqual(result.name, "foo.txt");
      assert.strictEqual(result.extension, ".txt");
    });

    it("handles file in subdirectory", function () {
      const result = splitPath("src/foo.txt");
      assert.strictEqual(result.atRoot, false);
      assert.strictEqual(result.dirPath, "src");
      assert.strictEqual(result.name, "foo.txt");
      assert.strictEqual(result.extension, ".txt");
    });

    it("handles file in nested subdirectory", function () {
      const result = splitPath("src/lib/foo.txt");
      assert.strictEqual(result.atRoot, false);
      assert.strictEqual(result.dirPath, "src/lib");
      assert.strictEqual(result.name, "foo.txt");
      assert.strictEqual(result.extension, ".txt");
    });

    it("handles file with no extension", function () {
      const result = splitPath("src/foo");
      assert.strictEqual(result.atRoot, false);
      assert.strictEqual(result.dirPath, "src");
      assert.strictEqual(result.name, "foo");
      assert.strictEqual(result.extension, "");
    });

    it("handles file with multiple dots", function () {
      const result = splitPath("src/foo.bar.txt");
      assert.strictEqual(result.atRoot, false);
      assert.strictEqual(result.dirPath, "src");
      assert.strictEqual(result.name, "foo.bar.txt");
      assert.strictEqual(result.extension, ".txt");
    });

    it("handles file starting with dot", function () {
      const result = splitPath("src/.env");
      assert.strictEqual(result.atRoot, false);
      assert.strictEqual(result.dirPath, "src");
      assert.strictEqual(result.name, ".env");
      assert.strictEqual(result.extension, "");
    });

    it("handles file with spaces", function () {
      const result = splitPath("src/my file.txt");
      assert.strictEqual(result.atRoot, false);
      assert.strictEqual(result.dirPath, "src");
      assert.strictEqual(result.name, "my file.txt");
      assert.strictEqual(result.extension, ".txt");
    });
  });

  describe("#quoteForSpaces", function () {
    it("add quotes for values with spaces", function () {
      assert.strictEqual(quoteForSpaces("foo bar.txt"), "'foo bar.txt'");

      assert.strictEqual(
        quoteForSpaces("fizz buzz/foo bar.txt"),
        "'fizz buzz/foo bar.txt'",
      );
    });

    it("returns the original value if there are no spaces", function () {
      assert.strictEqual(quoteForSpaces("fizz.txt"), "fizz.txt");

      assert.strictEqual(
        quoteForSpaces("fizz-buzz/foo-bar.txt"),
        "fizz-buzz/foo-bar.txt",
      );
    });
  });

  describe("#_join", function () {
    it("returns one item", function () {
      const result = _join(["foo"]);
      assert.strictEqual(result, "foo");
    });

    it('returns two items joined with "and"', function () {
      const result = _join(["foo", "bar"]);
      assert.strictEqual(result, "foo and bar");
    });

    it('returns three items joined with commands and an an "and"', function () {
      const result = _join(["foo", "bar", "bazz"]);
      assert.strictEqual(result, "foo, bar and bazz");
    });

    it("returns empty string for now items", function () {
      const result = _join([]);
      assert.strictEqual(result, "");
    });
  });

  describe("#friendlyFile", function () {
    it("formats a long path as a filename only", function () {
      assert.strictEqual(friendlyFile("Baz.txt"), "Baz.txt");
      assert.strictEqual(friendlyFile("bazz/Baz.txt"), "Baz.txt");
    });

    it("formats a README file as a full path", function () {
      assert.strictEqual(friendlyFile("README.md"), "README.md");
      assert.strictEqual(friendlyFile("foo/README.md"), "foo/README.md");
      assert.strictEqual(friendlyFile("bar/readme.txt"), "bar/readme.txt");
    });

    it("formats an index file as a full path", function () {
      assert.strictEqual(friendlyFile("Foo/index.md"), "Foo/index.md");
      assert.strictEqual(friendlyFile("Foo/index.html"), "Foo/index.html");
      assert.strictEqual(friendlyFile("Foo/index.js"), "Foo/index.js");
    });
  });

  describe("#humanList", function () {
    it("returns a path for a single file", function () {
      assert.strictEqual(humanList(["foo.txt"]), "foo.txt");
    });

    it("returns a sentence for two files", function () {
      assert.strictEqual(
        humanList(["foo.txt", "bar.txt"]),
        "foo.txt and bar.txt",
      );
    });

    it("returns a sentence for three files", function () {
      assert.strictEqual(
        humanList(["foo.txt", "bar.txt", "bazz.js"]),
        "foo.txt, bar.txt and bazz.js",
      );
    });

    it("returns a sentence for four files", function () {
      assert.strictEqual(
        humanList(["foo.txt", "bar.txt", "bazz.js", "buzz.ts"]),
        "foo.txt, bar.txt, bazz.js and buzz.ts",
      );
    });

    it("returns a sentence for four longer paths", function () {
      const input = [
        "foo.txt",
        "docs/README.md",
        "src/lib/bazz.js",
        "src/buzz.ts",
      ];
      assert.strictEqual(
        humanList(input),
        "foo.txt, docs/README.md, bazz.js and buzz.ts",
      );
    });

    it("throws an error for zero files", function () {
      assert.throws(() => humanList([]));
    });
  });
});
