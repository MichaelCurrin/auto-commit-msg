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
  //   - The command `git status --short` expects `XY` format but this is for
  //     `git diff-index` which is only `X`. Also there is just spaces between -
  //     no '->' symbol.
  //   - Impossible cases are not covered here, like renaming a file and the
  //     name and path are unchanged, or including two file names for an add
  //     line. But validation on at least file name is done.
  describe("#oneChange", function () {
    it("returns the appropriate commit message for a new file", function () {
      assert.strictEqual(oneChange("A\tfoo.txt"), "create foo.txt");

      // TODO: Maybe 'create foo.txt in bar', if the dir is not too long?
      assert.strictEqual(oneChange("A\tbar/foo.txt"), "create foo.txt");

      assert.strictEqual(oneChange("A\tfoo bar.txt"), "create foo bar.txt");
      assert.strictEqual(
        oneChange("A\tfizz buzz/foo bar.txt"),
        "create foo bar.txt"
      );
    });

    it("throws an error if no file path can be no generated", function () {
      assert.throws(() => oneChange("A    "));
    });

    it("returns the appropriate commit message for a modified file", function () {
      assert.strictEqual(oneChange("M\tfoo.txt"), "update foo.txt");
      assert.strictEqual(oneChange("M\tbar/foo.txt"), "update foo.txt");
    });

    it("returns the appropriate commit message for a deleted file", function () {
      assert.strictEqual(oneChange("D\tfoo.txt"), "delete foo.txt");
      assert.strictEqual(oneChange("D\tbar/foo.txt"), "delete foo.txt");
    });

    it("describes a file renamed in the same directory", function () {
      assert.strictEqual(
        oneChange("R\tfoo.txt\tbar.txt"),
        "rename foo.txt to bar.txt"
      );

      assert.strictEqual(
        oneChange("R\tfizz/foo.txt\tfizz/bar.txt"),
        "rename foo.txt to bar.txt"
      );
    });

    it("ignores percentage change in a renamed file", function () {
      // We don't care about getting the percentage out in this project. So just
      // make sure it does get ignored.
      assert.strictEqual(
        oneChange("R97\tfoo.txt\tbar.txt"),
        "rename foo.txt to bar.txt"
      );
    });

    it("describes a file moved out of the repo root to another directory", function () {
      assert.strictEqual(
        oneChange("R\tfoo.txt\tfizz/foo.txt"),
        "move foo.txt to fizz"
      );

      assert.strictEqual(
        oneChange("R\tfoo.txt\tfizz/buzz/foo.txt"),
        "move foo.txt to fizz/buzz"
      );

      assert.strictEqual(
        oneChange("R\tfoo.txt\tfizz buzz/foo.txt"),
        "move foo.txt to fizz buzz"
      );

      assert.strictEqual(
        oneChange("R\tfoo bar.txt\tfizz/foo bar.txt"),
        "move foo bar.txt to fizz"
      );
    });

    it("describes a file moved out of a subdirectory", function () {
      assert.strictEqual(
        oneChange("R\tfizz/buzz/foo.txt\tfoo.txt"),
        "move foo.txt to repo root"
      );

      assert.strictEqual(
        oneChange("R\tfizz/buzz/foo.txt\tfizz/foo.txt"),
        "move foo.txt to fizz"
      );

      assert.strictEqual(
        oneChange("R\tfizz/buzz/foo.txt\tfizz/buzz/foo.txt"),
        "move foo.txt to fizz/buzz"
      );
    });

    it("describes a file that was both moved and renamed", function () {
      assert.strictEqual(
        oneChange("R\tfoo.txt\tfizz/fuzz.txt"),
        "move and rename foo.txt to fizz/fuzz.txt"
      );

      assert.strictEqual(
        oneChange("R\tbar/foo.txt\tfuzz.txt"),
        "move and rename foo.txt to fuzz.txt at repo root"
      );

      assert.strictEqual(
        oneChange("R\tbar/foo.txt\tfizz/fuzz.txt"),
        "move and rename foo.txt to fizz/fuzz.txt"
      );
    });

    it("ignores percentage changed value for a file that was both moved and renamed", function () {
      assert.strictEqual(
        oneChange("R97\tfoo.txt\tfizz/fuzz.txt"),
        "move and rename foo.txt to fizz/fuzz.txt"
      );
    });

    it("uses the full path to describe index files", function () {
      assert.strictEqual(oneChange("A\tREADME.md"), "create README.md");
      assert.strictEqual(oneChange("M\tREADME.md"), "update README.md");
      assert.strictEqual(oneChange("D\tREADME.md"), "delete README.md");

      assert.strictEqual(oneChange("A\tfoo/README.md"), "create foo/README.md");
      assert.strictEqual(
        oneChange("M\tbar/baz/README.md"),
        "update bar/baz/README.md"
      );
      assert.strictEqual(
        oneChange("D\tbar/baz/buzz/README.md"),
        "delete bar/baz/buzz/README.md"
      );

      assert.strictEqual(oneChange("A\tfoo/index.md"), "create foo/index.md");
      assert.strictEqual(oneChange("A\tfoo/index.js"), "create foo/index.js");
    });
  });
});

describe("Generate description for a few changed files which each get named", function () {
  describe("#namedFilesDesc", function () {
    it("return the appropriate commit message for two files", function () {
      assert.strictEqual(
        namedFilesDesc([
          { x: "A", from: "foo.txt", y: " ", to: "" },
          { x: "A", from: "bar.txt", y: " ", to: "" },
        ]),
        "create foo.txt and bar.txt"
      );

      assert.strictEqual(
        namedFilesDesc([
          { x: "M", from: "foo.txt", y: " ", to: "" },
          { x: "M", from: "bar.txt", y: " ", to: "" },
        ]),
        "update foo.txt and bar.txt"
      );

      assert.strictEqual(
        namedFilesDesc([
          { x: "M", from: "fizz.js", y: " ", to: "" },
          { x: "M", from: "buzz.ts", y: " ", to: "" },
        ]),
        "update fizz.js and buzz.ts"
      );
    });

    it("return a commit message for more than two files", function () {
      assert.strictEqual(
        namedFilesDesc([
          { x: "A", from: "foo.txt", y: " ", to: "" },
          { x: "A", from: "docs/bar.txt", y: " ", to: "" },
          { x: "A", from: "buzz.js", y: " ", to: "" },
        ]),
        "create foo.txt, bar.txt and buzz.js"
      );

      assert.strictEqual(
        namedFilesDesc([
          { x: "D", from: "foo.txt", y: " ", to: "" },
          { x: "D", from: "docs/bar.txt", y: " ", to: "" },
          { x: "D", from: "buzz.js", y: " ", to: "" },
        ]),
        "delete foo.txt, bar.txt and buzz.js"
      );
    });

    it("handles differing actions", function () {
      assert.strictEqual(
        namedFilesDesc([
          { x: "A", from: "foo.txt", y: " ", to: "" },
          { x: "M", from: "bar.txt", y: " ", to: "" },
        ]),
        "create 1 file and update 1 file"
      );

      assert.strictEqual(
        namedFilesDesc([
          { x: "M", from: "foo.txt", y: " ", to: "" },
          { x: "D", from: "bar.txt", y: " ", to: "" },
        ]),
        "update 1 file and delete 1 file"
      );
    });
  });
});
