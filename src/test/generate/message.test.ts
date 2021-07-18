/**
 * Message test module.
 *
 * High-level test of the message shown to the user, based on changes to one or more files. This
 * includes the action verb in a sentence, along with named files, but not the conventional commit
 * prefix.
 */
import * as assert from "assert";
import { namedFilesDesc, oneChange } from "../../generate/message";

describe("Generate commit message for a single changed file", function () {
  // Notes:
  //   - The command `git status --short` expects XY format but this is for `git diff-index` which
  //     is only X. Also there is just spaces between - no '->' symbol.
  //   - Impossible cases are not covered here, like renaming a file and the name and path are
  //     unchanged, or including two file names for an add line. But validation on at least file
  //     name is done.
  describe("#oneChange", function () {
    it("returns the appropriate commit message for a new file", function () {
      assert.strictEqual(oneChange("A    foo.txt"), "create foo.txt");
      // Maybe create foo.txt in bar, if the dir is not too long?
      assert.strictEqual(oneChange("A    bar/foo.txt"), "create foo.txt");
    });

    it("throws an error if no filepath can be no generated", function () {
      assert.throws(() => oneChange("A    "));
    });

    it("returns the appropriate commit message for a modified file", function () {
      assert.strictEqual(oneChange("M    foo.txt"), "update foo.txt");
      assert.strictEqual(oneChange("M    bar/foo.txt"), "update foo.txt");
    });

    it("returns the appropriate commit message for a deleted file", function () {
      assert.strictEqual(oneChange("D    foo.txt"), "delete foo.txt");
      assert.strictEqual(oneChange("D    bar/foo.txt"), "delete foo.txt");
    });

    it("describes a file renamed in the same directory", function () {
      assert.strictEqual(
        oneChange("R    foo.txt          bar.txt"),
        "rename foo.txt to bar.txt"
      );

      assert.strictEqual(
        oneChange("R    fizz/foo.txt     fizz/bar.txt"),
        "rename foo.txt to bar.txt"
      );
    });

    it("ignores percentage change in a renamed file", function () {
      // We don't care about getting the percentage out in this project. So just make sure it does
      // get ignored.
      assert.strictEqual(
        oneChange("R97    foo.txt    bar.txt"),
        "rename foo.txt to bar.txt"
      );
    });

    it("describes a file moved out of the repo root", function () {
      assert.strictEqual(
        oneChange("R    foo.txt      fizz/foo.txt"),
        "move foo.txt to fizz"
      );

      assert.strictEqual(
        oneChange("R    foo.txt      fizz/buzz/foo.txt"),
        "move foo.txt to fizz/buzz"
      );
    });

    it("describes a file moved out of a subdirectory", function () {
      assert.strictEqual(
        oneChange("R     fizz/buzz/foo.txt    foo.txt"),
        "move foo.txt to repo root"
      );

      assert.strictEqual(
        oneChange("R     fizz/buzz/foo.txt    fizz/foo.txt"),
        "move foo.txt to fizz"
      );

      assert.strictEqual(
        oneChange("R     fizz/buzz/foo.txt    fizz/buzz/foo.txt"),
        "move foo.txt to fizz/buzz"
      );
    });

    it("describes a file that was both moved and renamed", function () {
      assert.strictEqual(
        oneChange("R    foo.txt       fizz/fuzz.txt"),
        "move and rename foo.txt to fizz/fuzz.txt"
      );

      assert.strictEqual(
        oneChange("R    bar/foo.txt   fuzz.txt"),
        "move and rename foo.txt to fuzz.txt at repo root"
      );

      assert.strictEqual(
        oneChange("R    bar/foo.txt   fizz/fuzz.txt"),
        "move and rename foo.txt to fizz/fuzz.txt"
      );
    });

    it("ignores percentage changed value for a file that was both moved and renamed", function () {
      assert.strictEqual(
        oneChange("R97  foo.txt       fizz/fuzz.txt"),
        "move and rename foo.txt to fizz/fuzz.txt"
      );
    });

    it("uses the full path to describe index files", function () {
      assert.strictEqual(oneChange("A    README.md"), "create README.md");
      assert.strictEqual(oneChange("M    README.md"), "update README.md");
      assert.strictEqual(oneChange("D    README.md"), "delete README.md");

      assert.strictEqual(
        oneChange("A    foo/README.md"),
        "create foo/README.md"
      );
      assert.strictEqual(
        oneChange("M    bar/baz/README.md"),
        "update bar/baz/README.md"
      );
      assert.strictEqual(
        oneChange("D    bar/baz/buzz/README.md"),
        "delete bar/baz/buzz/README.md"
      );

      assert.strictEqual(oneChange("A    foo/index.md"), "create foo/index.md");
      assert.strictEqual(oneChange("A    foo/index.js"), "create foo/index.js");
    });
  });
});

describe("Generate description for a few changed files which each get named", function () {
  describe("#namedFilesDesc", function () {
    it("return the appropriate commit message for two files", function () {
      assert.strictEqual(
        namedFilesDesc(["A    foo.txt", "A    bar.txt"]),
        "create foo.txt and bar.txt"
      );

      assert.strictEqual(
        namedFilesDesc(["M    foo.txt", "M    bar.txt"]),
        "update foo.txt and bar.txt"
      );

      assert.strictEqual(
        namedFilesDesc(["M    fizz.js", "M    buzz.ts"]),
        "update fizz.js and buzz.ts"
      );
    });

    it("return a commit message for more than two files", function () {
      assert.strictEqual(
        namedFilesDesc(["A    foo.txt", "A    docs/bar.txt", "A    buzz.js"]),
        "create foo.txt, bar.txt and buzz.js"
      );

      assert.strictEqual(
        namedFilesDesc(["D    foo.txt", "D    docs/bar.txt", "D    buzz.js"]),
        "delete foo.txt, bar.txt and buzz.js"
      );
    });

    it("handles differing actions", function () {
      assert.strictEqual(
        namedFilesDesc(["A    foo.txt", "M    bar.txt"]),
        "create 1 file and update 1 file"
      );

      assert.strictEqual(
        namedFilesDesc(["M    foo.txt", "D    bar.txt"]),
        "update 1 file and delete 1 file"
      );
    });
  });
});
