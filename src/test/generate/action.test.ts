/**
 * Action test module to check action verbs used.
 */
import * as assert from "assert";
import { lookupDiffIndexAction, moveOrRenameMsg } from "../../generate/action";

describe("Desribe a file using a single path", function () {
  describe("#lookupDiffIndexAction", function () {
    it("can describe an updated file", function () {
      assert.strictEqual(lookupDiffIndexAction("M"), "update");
    });

    it("can describe a created file", function () {
      assert.strictEqual(lookupDiffIndexAction("A"), "create");
    });

    it("can describe a deleted file", function () {
      assert.strictEqual(lookupDiffIndexAction("D"), "delete");
    });

    it("can describe a renamed file", function () {
      assert.strictEqual(lookupDiffIndexAction("R"), "rename");
    });

    it("can describe a copied file", function () {
      assert.strictEqual(lookupDiffIndexAction("C"), "copy");
    });

    it("can throws an error for a bad key", function () {
      assert.throws(() => lookupDiffIndexAction("Z"));
    });
  });
});

describe("Desribe a file using two paths", function () {
  describe("#moveOrRenameFile", function () {
    it("can describe a renamed file", function () {
      assert.strictEqual(
        moveOrRenameMsg("foo.txt", "bar.txt"),
        "rename foo.txt to bar.txt"
      );
      assert.strictEqual(
        moveOrRenameMsg("buzz/foo.txt", "buzz/bar.txt"),
        "rename foo.txt to bar.txt"
      );
    });

    it("can describe a moved file", function () {
      assert.strictEqual(
        moveOrRenameMsg("buzz/foo.txt", "fizz/foo.txt"),
        "move foo.txt to fizz"
      );
      assert.strictEqual(
        moveOrRenameMsg("buzz/foo.txt", "foo.txt"),
        "move foo.txt to repo root"
      );
    });

    it("can describe a remamed and moved file", function () {
      assert.strictEqual(
        moveOrRenameMsg("foo.txt", "fizz/bar.txt"),
        "move and rename foo.txt to fizz/bar.txt"
      );
      // This is a rare case, so don't bother trying to handle it smarter around paths.
      assert.strictEqual(
        moveOrRenameMsg("fuzz/foo.txt", "fizz/bar.txt"),
        "move and rename foo.txt to fizz/bar.txt"
      );
      assert.strictEqual(
        moveOrRenameMsg("fizz/foo.txt", "bar.txt"),
        "move and rename foo.txt to bar.txt at repo root"
      );
    });
  });
});
