/**
 * Parse Git output test module.
 *
 * Check the ability to convert text output from Git subcommands into JS
 * objects.
 */
import * as assert from "assert";
import { parseDiffIndex, parseStatus } from "../../git/parseOutput";
import { FileChange } from "../../git/parseOutput.d";

test("Split `git diff-index` output into components", function () {
  test("#parseDiffIndex", function () {
    test("states with a single path", function () {
      test("should return the appropriate commit message for a new file", function () {
        const expected: FileChange = {
          x: "A",
          y: " ",
          from: "foo.txt",
          to: "",
        };

        assert.deepStrictEqual(parseDiffIndex("A\tfoo.txt"), expected);
      });

      test("should return the appropriate commit message for a modified file", function () {
        const expected: FileChange = {
          x: "M",
          y: " ",
          from: "foo.txt",
          to: "",
        };

        assert.deepStrictEqual(parseDiffIndex("M\tfoo.txt"), expected);
      });

      test("should return the appropriate commit message for a deleted file", function () {
        const expected: FileChange = {
          x: "D",
          y: " ",
          from: "foo.txt",
          to: "",
        };

        assert.deepStrictEqual(parseDiffIndex("D\tfoo.txt"), expected);
      });
    });

    test("states with two paths", function () {
      test("should return the correct commit message for a renamed unchanged file", function () {
        const expected: FileChange = {
          x: "R",
          y: " ",
          from: "bar.txt",
          to: "foo.txt",
        };

        assert.deepStrictEqual(
          parseDiffIndex("R100\tbar.txt\tfoo.txt"),
          expected
        );

        test("should return the appropriate commit message for a moved file", function () {
          const expected: FileChange = {
            x: "R",
            y: " ",
            from: "bar.txt",
            to: "fizz/foo.txt",
          };

          assert.deepStrictEqual(
            parseDiffIndex("R100\tbar.txt\tfizz/foo.txt"),
            expected
          );
        });
      });

      test("returns a correct commit message for a renamed modified file", function () {
        const expected: FileChange = {
          x: "R",
          y: " ",
          from: "bar.txt",
          to: "foo.txt",
        };
        assert.deepStrictEqual(
          parseDiffIndex("R096\tbar.txt\tfoo.txt"),
          expected
        );

        test("should return the appropriate commit message for a moved file", function () {
          const expected: FileChange = {
            x: "R",
            y: " ",
            to: "bar.txt",
            from: "fizz/foo.txt",
          };

          assert.deepStrictEqual(
            parseDiffIndex("R096\tbar.txt\tfizz/foo.txt"),
            expected
          );
        });
      });
    });

    test("handle paths with spaces in them", function () {
      // No quoting is needed here as that is only needed when formatting the
      // final message.

      test("should handle a single path correctly", function () {
        {
          const expected: FileChange = {
            x: "A",
            y: " ",
            from: "foo bar.txt",
            to: "",
          };

          assert.deepStrictEqual(parseDiffIndex("A\tfoo bar.txt"), expected);
        }

        {
          const expected: FileChange = {
            x: "A",
            y: " ",
            from: "foo bar fizz buzz.txt",
            to: "",
          };

          assert.deepStrictEqual(
            parseDiffIndex("A\tfoo bar fizz buzz.txt"),
            expected
          );
        }

        {
          const expected: FileChange = {
            x: "A",
            y: " ",
            from: "fizz/foo bar.txt",
            to: "",
          };

          assert.deepStrictEqual(
            parseDiffIndex("A\tfizz/foo bar.txt"),
            expected
          );
        }

        {
          const expected: FileChange = {
            x: "A",
            y: " ",
            from: "fizz buzz/foo bar.txt",
            to: "",
          };

          assert.deepStrictEqual(
            parseDiffIndex("A\tfizz buzz/foo bar.txt"),
            expected
          );
        }
      });
    });

    test("should handle a pair of paths correctly", function () {
      {
        const expected: FileChange = {
          x: "R",
          y: " ",
          from: "foo bar.txt",
          to: "fizz/foo bar.txt",
        };

        assert.deepStrictEqual(
          parseDiffIndex("R100\tfoo bar.txt\tfizz/foo bar.txt"),
          expected
        );
      }

      {
        const expected: FileChange = {
          x: "R",
          y: " ",
          from: "foo bar.txt",
          to: "fizz buzz/foo bar.txt",
        };

        assert.deepStrictEqual(
          parseDiffIndex("R100\tfoo bar.txt\tfizz buzz/foo bar.txt"),
          expected
        );
      }
    });

    test("throws an error on input that is too short", function () {
      assert.throws(() => parseDiffIndex("abc"));
    });
  });
});

// Not a core part of this extension anymore, but the code and tests are kept
// anyway.
test("Split `git status` output into components", function () {
  test("#parseStatus", function () {
    test("should return the appropriate commit message for a new file", function () {
      const expected: FileChange = {
        x: "A",
        y: " ",
        from: "foo.txt",
        to: "",
      };

      assert.deepStrictEqual(parseStatus("A \tfoo.txt"), expected);
    });

    test("should return the appropriate commit message for a modified file", function () {
      const expected: FileChange = {
        x: " ",
        y: "M",
        from: "foo.txt",
        to: "",
      };

      assert.deepStrictEqual(parseStatus(" M\tfoo.txt"), expected);
    });

    test("should return the appropriate commit message for a deleted file", function () {
      const expected: FileChange = {
        x: "D",
        y: " ",
        from: "foo.txt",
        to: "",
      };

      assert.deepStrictEqual(parseStatus("D  foo.txt"), expected);
    });

    test("should return the appropriate commit message for a renamed file", function () {
      const expected: FileChange = {
        x: "R",
        y: " ",
        from: "foo.txt",
        to: "bar.txt",
      };

      assert.deepStrictEqual(parseStatus("R  foo.txt -> bar.txt"), expected);

      test("should return the appropriate commit message for a moved file", function () {
        const expected: FileChange = {
          x: "R",
          y: " ",
          from: "foo.txt",
          to: "fizz/foo.txt",
        };

        assert.deepStrictEqual(
          parseStatus("R  foo.txt -> fizz/foo.txt"),
          expected
        );
      });
    });

    test("throws an error on input that is too short", function () {
      assert.throws(() => parseStatus("abc"));
    });
  });
});
