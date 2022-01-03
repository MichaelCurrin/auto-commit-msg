/**
 * Common path test module.
 *
 * Check that a common path can be found for paths.
 */
import * as assert from "assert";
import { commonPath, _splitStrings } from "../../lib/commonPath";

describe("Split an array of strings at a separator", function () {
  describe("#_splitStrings", function () {
    it("should split 3 strings correctly with the default separator", function () {
      const items = ["a/b/c", "ABC/DEF/GHI", "1/2/3"];

      const expected = [
        ["a", "b", "c"],
        ["ABC", "DEF", "GHI"],
        ["1", "2", "3"],
      ];

      assert.deepStrictEqual(_splitStrings(items), expected);
    });
  });
});

describe("Find the highest common parent directory for paths", function () {
  // This is useful when building a change message about multiple files and seeing what the high
  // common level is between them so this can be used in the message. If the parent directory is
  // needed for that to keep it much shorter, that is easy from the std lib.
  describe("#commonPath", function () {
    it("should give the common path for 3 root repo paths", function () {
      const paths = ["foo", "bar", "fizz/buzz"];

      assert.strictEqual(commonPath(paths), "repo root");
    });

    // These are relative to the repo root but don't have a forward slash,
    // based on git output from status or diff-index.
    it("should give the common path for 2 different paths", function () {
      const paths = ["Foo/test", "Foo/bar/test"];

      assert.strictEqual(commonPath(paths), "Foo");
    });

    it("should give the common path for 3 similar repo paths", function () {
      const paths = [
        "fizz/buzz/coverage/test",
        "fizz/buzz/covert/operator",
        "fizz/buzz/tmp/coven/members",
      ];

      assert.strictEqual(commonPath(paths), "fizz/buzz");
    });

    // This shouldn't matter for use in a repo but just check its robustness.
    it("should give the common path for 3 related absolute paths", function () {
      const paths = [
        "/home/user1/tmp/coverage/test",
        "/home/user1/tmp/covert/operator",
        "/home/user1/tmp/coven/members",
      ];

      assert.strictEqual(commonPath(paths), "/home/user1/tmp");
    });
  });
});
