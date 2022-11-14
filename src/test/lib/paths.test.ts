/**
 * Paths test module.
 *
 * Test handling of path values as text.
 */
import * as assert from "assert";
import { ROOT } from "../../lib/constants";
import {
  friendlyFile,
  humanList,
  quoteForSpaces,
  splitPath,
  _join,
} from "../../lib/paths";

test("Path handling", function () {
  test("#splitPath", function () {
    test("splits a path correctly", function () {
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
  });

  test("#quoteForSpaces", function () {
    test("add quotes for values with spaces", function () {
      assert.strictEqual(quoteForSpaces("foo bar.txt"), "'foo bar.txt'");

      assert.strictEqual(
        quoteForSpaces("fizz buzz/foo bar.txt"),
        "'fizz buzz/foo bar.txt'"
      );
    });

    test("returns the original value if there are no spaces", function () {
      assert.strictEqual(quoteForSpaces("fizz.txt"), "fizz.txt");

      assert.strictEqual(
        quoteForSpaces("fizz-buzz/foo-bar.txt"),
        "fizz-buzz/foo-bar.txt"
      );
    });
  });

  test("#_join", function () {
    test("returns one item", function () {
      const result = _join(["foo"]);
      assert.strictEqual(result, "foo");
    });

    test('returns two items joined with "and"', function () {
      const result = _join(["foo", "bar"]);
      assert.strictEqual(result, "foo and bar");
    });

    test('returns three items joined with commands and an an "and"', function () {
      const result = _join(["foo", "bar", "bazz"]);
      assert.strictEqual(result, "foo, bar and bazz");
    });

    test("returns empty string for now items", function () {
      const result = _join([]);
      assert.strictEqual(result, "");
    });
  });

  test("#friendlyFile", function () {
    test("formats a long path as a filename only", function () {
      assert.strictEqual(friendlyFile("Baz.txt"), "Baz.txt");
      assert.strictEqual(friendlyFile("bazz/Baz.txt"), "Baz.txt");
    });

    test("formats a README file as a full path", function () {
      assert.strictEqual(friendlyFile("README.md"), "README.md");
      assert.strictEqual(friendlyFile("foo/README.md"), "foo/README.md");
      assert.strictEqual(friendlyFile("bar/readme.txt"), "bar/readme.txt");
    });

    test("formats an index file as a full path", function () {
      assert.strictEqual(friendlyFile("Foo/index.md"), "Foo/index.md");
      assert.strictEqual(friendlyFile("Foo/index.html"), "Foo/index.html");
      assert.strictEqual(friendlyFile("Foo/index.js"), "Foo/index.js");
    });
  });

  test("#humanList", function () {
    test("returns a path for a single file", function () {
      assert.strictEqual(humanList(["foo.txt"]), "foo.txt");
    });

    test("returns a sentence for two files", function () {
      assert.strictEqual(
        humanList(["foo.txt", "bar.txt"]),
        "foo.txt and bar.txt"
      );
    });

    test("returns a sentence for three files", function () {
      assert.strictEqual(
        humanList(["foo.txt", "bar.txt", "bazz.js"]),
        "foo.txt, bar.txt and bazz.js"
      );
    });

    test("returns a sentence for four files", function () {
      assert.strictEqual(
        humanList(["foo.txt", "bar.txt", "bazz.js", "buzz.ts"]),
        "foo.txt, bar.txt, bazz.js and buzz.ts"
      );
    });

    test("returns a sentence for four longer paths", function () {
      const input = [
        "foo.txt",
        "docs/README.md",
        "src/lib/bazz.js",
        "src/buzz.ts",
      ];
      assert.strictEqual(
        humanList(input),
        "foo.txt, docs/README.md, bazz.js and buzz.ts"
      );
    });

    test("throws an error for zero files", function () {
      assert.throws(() => humanList([]));
    });
  });
});
