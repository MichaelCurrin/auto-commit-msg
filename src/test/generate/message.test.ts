/**
 * Message test module.
 *
 * High-level test of the message shown to the user, based on changes to one or more files. This
 * includes the action verb in a sentence along with named files, but not the semantic convention.
 */
import * as assert from "assert";
import { actionNamePairs, namedFiles, oneChange } from "../../generate/message";
import { ACTION } from "../../lib/constants";

describe("Generate commit message for a single changed file", function () {
  // Note that git status --short expects XY format but this is for git diff-index
  // which is only X. Also there is just spaces between - no '->' symbol.
  // Note that impossible cases are not covered here, like renaming a file and the name
  // and path are unchanged, or including two file names for an add line. But validation
  // on at least file name is done.
  describe("#oneChange()", function () {
    it("returns the appropriate commit message for a new file", function () {
      assert.strictEqual(oneChange("A    foo.txt"), "Create foo.txt");
      // Maybe create foo.txt in bar, if the dir is not too long?
      assert.strictEqual(oneChange("A    bar/foo.txt"), "Create foo.txt");
    });

    it("throws an error if no filepath can be no generated", function () {
      assert.throws(() => oneChange("A    "));
    });

    it("returns the appropriate commit message for a modified file", function () {
      assert.strictEqual(oneChange("M    foo.txt"), "Update foo.txt");
      assert.strictEqual(oneChange("M    bar/foo.txt"), "Update foo.txt");
    });

    it("returns the appropriate commit message for a deleted file", function () {
      assert.strictEqual(oneChange("D    foo.txt"), "Delete foo.txt");
      assert.strictEqual(oneChange("D    bar/foo.txt"), "Delete foo.txt");
    });

    it("describes a file renamed in the same directory", function () {
      assert.strictEqual(
        oneChange("R    foo.txt          bar.txt"),
        "Rename foo.txt to bar.txt"
      );

      assert.strictEqual(
        oneChange("R    fizz/foo.txt     fizz/bar.txt"),
        "Rename foo.txt to bar.txt"
      );
    });

    it("ignores percentage change in a renamed file", function () {
      // We don't care about getting the percentage out in this project. So just make sure it does
      // get ignored.
      assert.strictEqual(
        oneChange("R97    foo.txt    bar.txt"),
        "Rename foo.txt to bar.txt"
      );
    });

    it("describes a file moved out of the repo root", function () {
      assert.strictEqual(
        oneChange("R    foo.txt      fizz/foo.txt"),
        "Move foo.txt to fizz"
      );

      assert.strictEqual(
        oneChange("R    foo.txt      fizz/buzz/foo.txt"),
        "Move foo.txt to fizz/buzz"
      );
    });

    it("describes a file moved out of a subdirectory", function () {
      assert.strictEqual(
        oneChange("R     fizz/buzz/foo.txt    foo.txt"),
        "Move foo.txt to repo root"
      );

      assert.strictEqual(
        oneChange("R     fizz/buzz/foo.txt    fizz/foo.txt"),
        "Move foo.txt to fizz"
      );

      assert.strictEqual(
        oneChange("R     fizz/buzz/foo.txt    fizz/buzz/foo.txt"),
        "Move foo.txt to fizz/buzz"
      );
    });

    it("describes a file that was both moved and renamed", function () {
      assert.strictEqual(
        oneChange("R    foo.txt       fizz/fuzz.txt"),
        "Move and rename foo.txt to fizz/fuzz.txt"
      );

      assert.strictEqual(
        oneChange("R    bar/foo.txt   fuzz.txt"),
        "Move and rename foo.txt to fuzz.txt at repo root"
      );

      assert.strictEqual(
        oneChange("R    bar/foo.txt   fizz/fuzz.txt"),
        "Move and rename foo.txt to fizz/fuzz.txt"
      );
    });

    it("ignores percentage changed value for a file that was both moved and renamed", function () {
      assert.strictEqual(
        oneChange("R97  foo.txt       fizz/fuzz.txt"),
        "Move and rename foo.txt to fizz/fuzz.txt"
      );
    });

    it("uses the full path to describe index files", function () {
      assert.strictEqual(oneChange("A    README.md"), "Create README.md");
      assert.strictEqual(oneChange("M    README.md"), "Update README.md");
      assert.strictEqual(oneChange("D    README.md"), "Delete README.md");

      assert.strictEqual(
        oneChange("A    foo/README.md"),
        "Create foo/README.md"
      );
      assert.strictEqual(
        oneChange("M    bar/baz/README.md"),
        "Update bar/baz/README.md"
      );
      assert.strictEqual(
        oneChange("D    bar/baz/buzz/README.md"),
        "Delete bar/baz/buzz/README.md"
      );

      assert.strictEqual(oneChange("A    foo/index.md"), "Create foo/index.md");
      assert.strictEqual(oneChange("A    foo/index.js"), "Create foo/index.js");
    });
  });
});

describe("Generate commit message for a few changed files which each get named", function () {
  describe("#namedFiles()", function () {
    it("return the appropriate commit message for two files", function () {
      assert.strictEqual(namedFiles(
        ["A    foo.txt", "A    bar.txt"]
      ), "Create foo.txt and bar.txt");

      assert.strictEqual(namedFiles(
        ["M    foo.txt", "M    bar.txt"]
      ), "Update foo.txt and bar.txt");

      assert.strictEqual(namedFiles(
        ["M    fizz.js", "M    buzz.ts"]
      ), "Update fizz.js and buzz.ts");
    });

    it("return a commit message for more than two files", function () {
      assert.strictEqual(namedFiles(
        ["A    foo.txt", "A    docs/bar.txt", "A    buzz.js"]
      ), "Create foo.txt, docs/bar.txt and buzz.js");

      assert.strictEqual(namedFiles(
        ["D    foo.txt", "D    docs/bar.txt", "D    buzz.js"]
      ), "Delete foo.txt, docs/bar.txt and buzz.js");
    });

    it("handles differing actions", function () {
      assert.strictEqual(namedFiles(
        ["A    foo.txt", "M    bar.txt"]
      ), "Various changes to foo.txt and bar.txt");

      assert.strictEqual(namedFiles(
        ["M    foo.txt", "D    bar.txt"]
      ), "Various changes to foo.txt and bar.txt");
    });
  });
});

// TODO - move spliting of "A  foo.txt" into a high-level function and low level ones deal with
// objects to keep things simple and type safe.
describe("Generate message as verb and filename pairs", function () {
  describe("#actionNamePairs()", function () {
    it("return the appropriate commit message for two files", function () {
      const changes = [
        { action: ACTION.A, path: "foo.txt" },
        { action: ACTION.M, path: "bar.txt" },
      ];

      assert.strictEqual(
        actionNamePairs(changes),
        "Create foo.txt and update bar.txt"
      );
    });
  });
});
