/**
 * Message test module.
 *
 * High-level test of the message shown to the user, based on changes to one or more files. This
 * includes the action verb in a sentence along with named files, but not the semantic convention.
 */
import * as assert from "assert";
import { namedFiles, oneChange, _title } from "../../generate/message";

describe("Generate commit message for a single changed file", function () {
  describe("#title", function () {
    it("converts to titlecase correctly", function () {
      assert.strictEqual(_title("h"), "H");

      assert.strictEqual(_title("hello"), "Hello");
    });

    it("doesn't downcase uppercase letters", function () {
      assert.strictEqual(_title("Hello"), "Hello");

      assert.strictEqual(_title("hELLo"), "HELLo");
    });

    it("disallows empty string input", function () {
      assert.throws(() => _title(""));
    });
  });

  // Note that git status --short expects XY format but this is for git diff-index
  // which is only X. Also there is just spaces between - no '->' symbol.
  // Note that impossible cases are not covered here, like renaming a file and the name
  // and path are unchanged, or including two file names for an add line. But validation
  // on at least file name is done.
  describe("#oneChange", function () {
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
    it("return the appropriate commit message for a few files", function () {
      assert.strictEqual(namedFiles(
        ["A    foo.txt", "A    bar.txt"]
      ), "Create foo.txt and bar.txt");
    });
  });
});
