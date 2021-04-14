/**
 * Action test module to check action verbs used.
 */
import * as assert from "assert";
import { lookupDiffIndexAction, moveOrRenameFile, reduceActions } from "../../generate/action";

describe("Desribe a file using a single path", function () {
  describe("#lookupDiffIndexAction()", function () {
    it("can describe an updated file", function () {
      assert.strictEqual(
        lookupDiffIndexAction("M"),
        "update"
      );
    });

    it("can describe a created file", function () {
      assert.strictEqual(
        lookupDiffIndexAction("A"),
        "create"
      );
    });

    it("can describe a deleted file", function () {
      assert.strictEqual(
        lookupDiffIndexAction("D"),
        "delete"
      );
    });

    it("can describe a renamed file", function () {
      assert.strictEqual(
        lookupDiffIndexAction("R"),
        "rename"
      );
    });

    it("can describe a copied file", function () {
      assert.strictEqual(
        lookupDiffIndexAction("C"),
        "copy"
      );
    });
  });
});

describe("Desribe a file using two paths", function () {
  describe("#moveOrRenameFile()", function () {
    it("can describe a renamed file", function () {
      assert.strictEqual(
        moveOrRenameFile("foo.txt", "bar.txt"),
        "Rename foo.txt to bar.txt"
      );
      assert.strictEqual(
        moveOrRenameFile("buzz/foo.txt", "buzz/bar.txt"),
        "Rename foo.txt to bar.txt"
      );
    });

    it("can describe a moved file", function () {
      assert.strictEqual(
        moveOrRenameFile("buzz/foo.txt", "fizz/foo.txt"),
        "Move foo.txt to fizz"
      );
      assert.strictEqual(
        moveOrRenameFile("buzz/foo.txt", "foo.txt"),
        "Move foo.txt to repo root"
      );
    });

    it("can describe a remamed and moved file", function () {
      assert.strictEqual(
        moveOrRenameFile("foo.txt", "fizz/bar.txt"),
        "Move and rename foo.txt to fizz/bar.txt"
      );
      // This is a rare case, so don't bother trying to handle it smarter around paths.
      assert.strictEqual(
        moveOrRenameFile("fuzz/foo.txt", "fizz/bar.txt"),
        "Move and rename foo.txt to fizz/bar.txt"
      );
      assert.strictEqual(
        moveOrRenameFile("fizz/foo.txt", "bar.txt"),
        "Move and rename foo.txt to bar.txt at repo root"
      );
    });
  });
});

describe("Desribe action across multiple files", function () {
  describe("#actionFromFiles()", function () {
    it("returns the correct action for identical actions", function () {
      assert.strictEqual(reduceActions(["M", "M"]), "update");
      assert.strictEqual(reduceActions(["A", "A", "A"]), "create");
    });

    it("returns the null action for different actions", function () {
      assert.strictEqual(reduceActions(["A", "M"]), "");
      assert.strictEqual(reduceActions(["A", "M", "A"]), "");
    });
  });
});
