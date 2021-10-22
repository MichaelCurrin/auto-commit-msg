/**
 * Prepare commit message test module.
 *
 * Check creation of commit message.
 */
import * as assert from "assert";
import { CONVENTIONAL_TYPE } from "../lib/constants";
import {
  generateMsg,
  _cleanJoin,
  _collapse,
  _combineOldAndNew,
  _formatMsg,
  _generateMsgWithOld,
  _msgCount,
  _msgFromChanges,
  _msgNamed,
  _newMsg,
  _prefixFromChange,
} from "../prepareCommitMsg";

describe("Join strings cleanly", function () {
  describe("#_cleanJoin", function () {
    it("joins two set strings", function () {
      assert.strictEqual(_cleanJoin("abc", "def"), "abc def");
      assert.strictEqual(_cleanJoin(" abc", "def "), "abc def");
    });

    it("uses the first string if the second is not set", function () {
      assert.strictEqual(_cleanJoin("abc", ""), "abc");
      assert.strictEqual(_cleanJoin("abc ", ""), "abc");
    });

    it("uses the second string if the first is not set", function () {
      assert.strictEqual(_cleanJoin("", "abc def"), "abc def");
      assert.strictEqual(_cleanJoin("", "abc def "), "abc def");
    });

    it("returns the first string if they are identical, ignoring spaces", function () {
      assert.strictEqual(_cleanJoin("abc def", "abc def"), "abc def");
      assert.strictEqual(_cleanJoin("abc def", " abc def "), "abc def");
    });
  });
});

describe("Find prefix from Git output", function () {
  describe("#_prefixFromChange", function () {
    describe("generic file", function () {
      it("recognizes a new generic file as a feature", function () {
        assert.strictEqual(
          _prefixFromChange("A    foo.txt"),
          CONVENTIONAL_TYPE.FEAT
        );
      });

      it("recognizes a modified generic file as a unknown", function () {
        assert.strictEqual(
          _prefixFromChange("M    foo.txt"),
          CONVENTIONAL_TYPE.UNKNOWN
        );
      });

      it("recognizes a deleted generic file as a chore", function () {
        assert.strictEqual(
          _prefixFromChange("D    foo.txt"),
          CONVENTIONAL_TYPE.CHORE
        );
      });

      it("recognizes a renamed generic file as a chore", function () {
        assert.strictEqual(
          _prefixFromChange("R    foo.txt bar.txt"),
          CONVENTIONAL_TYPE.CHORE
        );
      });

      it("recognizes a moved generic file as a chore", function () {
        assert.strictEqual(
          _prefixFromChange("R    foo.txt bar/foo.txt"),
          CONVENTIONAL_TYPE.CHORE
        );
      });
    });

    describe("categorized file change", function () {
      /// Don't need to cover every type here - just docs should be fine.

      it("recognizes a new docs file change as docs", function () {
        const expected = CONVENTIONAL_TYPE.DOCS;

        assert.strictEqual(_prefixFromChange("A    README.md"), expected);
        assert.strictEqual(_prefixFromChange("A    docs/abc.md"), expected);
      });

      it("recognizes an updated docs file change as docs", function () {
        const expected = CONVENTIONAL_TYPE.DOCS;

        assert.strictEqual(_prefixFromChange("M    README.md"), expected);
        assert.strictEqual(_prefixFromChange("M    docs/foo.md"), expected);
      });

      it("recognizes a deleted docs file change as docs", function () {
        const expected = CONVENTIONAL_TYPE.DOCS;

        assert.strictEqual(_prefixFromChange("M    README.md"), expected);
        assert.strictEqual(_prefixFromChange("M    docs/foo.md"), expected);
      });

      it("recognizes a renamed docs file change as chore", function () {
        const expected = CONVENTIONAL_TYPE.CHORE;

        assert.strictEqual(
          _prefixFromChange("R    README.md bar.md"),
          expected
        );
        assert.strictEqual(
          _prefixFromChange("R    docs/foo.md docs/bar.md"),
          expected
        );
      });
      it("recognizes a moved docs file change as chore", function () {
        const expected = CONVENTIONAL_TYPE.CHORE;

        assert.strictEqual(
          _prefixFromChange("R    README.md bar/README.md"),
          expected
        );
        assert.strictEqual(
          _prefixFromChange("R    docs/foo.md bar/foo.md"),
          expected
        );
      });
    });

    describe("categorized file change with scope", function () {
      it("recognizes a new build deps file change as build deps", function () {
        const expected = CONVENTIONAL_TYPE.BUILD_DEPENDENCIES;

        assert.strictEqual(
          _prefixFromChange("A    package-lock.json"),
          expected
        );
      });

      it("recognizes an updated build deps file change as build deps", function () {
        const expected = CONVENTIONAL_TYPE.BUILD_DEPENDENCIES;

        assert.strictEqual(
          _prefixFromChange("M    package-lock.json"),
          expected
        );
      });

      it("recognizes a renamed build deps file change as chore", function () {
        const expected = CONVENTIONAL_TYPE.CHORE;

        assert.strictEqual(
          _prefixFromChange("R    package-lock.json foo.json"),
          expected
        );
      });

      it("recognizes a moved build deps file change as chore", function () {
        const expected = CONVENTIONAL_TYPE.CHORE;

        assert.strictEqual(
          _prefixFromChange("R    package-lock.json foo/package-lock.json"),
          expected
        );
      });
    });
  });
});

describe("Choose a prefix type from multiple", function () {
  describe("#_collapse", function () {
    it("uses unknown for zero items", function () {
      const expected = CONVENTIONAL_TYPE.UNKNOWN;

      assert.strictEqual(_collapse([]), expected);
    });

    it("gets the type of the item when there is only one", function () {
      const expected = CONVENTIONAL_TYPE.FEAT;
      assert.strictEqual(_collapse([CONVENTIONAL_TYPE.FEAT]), expected);
    });

    it("gets the type of the first item for identical items", function () {
      const expected = CONVENTIONAL_TYPE.FEAT;

      assert.strictEqual(
        _collapse([CONVENTIONAL_TYPE.FEAT, CONVENTIONAL_TYPE.FEAT]),
        expected
      );

      assert.strictEqual(
        _collapse([
          CONVENTIONAL_TYPE.FEAT,
          CONVENTIONAL_TYPE.FEAT,
          CONVENTIONAL_TYPE.FEAT,
        ]),
        expected
      );
    });

    it("returns unknown when items differ", function () {
      const expected = CONVENTIONAL_TYPE.UNKNOWN;

      assert.strictEqual(
        _collapse([CONVENTIONAL_TYPE.FEAT, CONVENTIONAL_TYPE.DOCS]),
        expected
      );

      assert.strictEqual(
        _collapse([
          CONVENTIONAL_TYPE.FEAT,
          CONVENTIONAL_TYPE.DOCS,
          CONVENTIONAL_TYPE.CHORE,
        ]),
        expected
      );
    });

    it("uses build deps change if at least one is present", function () {
      const expected = CONVENTIONAL_TYPE.BUILD_DEPENDENCIES;
      assert.strictEqual(
        _collapse([
          CONVENTIONAL_TYPE.FEAT,
          CONVENTIONAL_TYPE.BUILD_DEPENDENCIES,
        ]),
        expected
      );
      assert.strictEqual(
        _collapse([
          CONVENTIONAL_TYPE.FEAT,
          CONVENTIONAL_TYPE.BUILD_DEPENDENCIES,
          CONVENTIONAL_TYPE.CHORE,
        ]),
        expected
      );
    });
  });
});

describe("Prepare commit message", function () {
  describe("#_msgNamed", function () {
    describe("single file changes", function () {
      it("handles a single file change", function () {
        const lines = ["A    baz.txt"];
        const expected = {
          prefixType: CONVENTIONAL_TYPE.FEAT,
          description: "create baz.txt",
        };

        assert.deepStrictEqual(_msgNamed(lines), expected);
      });
    });

    describe("a few files", function () {
      describe("multiple files with the same action", function () {
        it("handles 2 created files created correctly", function () {
          const lines = ["A    baz.txt", "A    bar.js"];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.FEAT,
            description: "create baz.txt and bar.js",
          };

          assert.deepStrictEqual(_msgNamed(lines), expected);
        });

        it("handles 2 modified files correctly", function () {
          const lines = ["M    baz.txt", "M    bar.js"];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.UNKNOWN,
            description: "update baz.txt and bar.js",
          };

          assert.deepStrictEqual(_msgNamed(lines), expected);
        });

        it("handles 3 files with the same action correctly", function () {
          const lines = ["A    baz.txt", "A    bar.js", "A    fizz/fuzz.md"];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.FEAT,
            description: "create baz.txt, bar.js and fuzz.md",
          };

          assert.deepStrictEqual(_msgNamed(lines), expected);
        });

        it("handles 4 files with the same action correctly", function () {
          const lines = [
            "A    baz.txt",
            "A    bar.js",
            "A    fuzz.md",
            "A    fuzz.ts",
          ];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.FEAT,
            description: "create baz.txt, bar.js, fuzz.md and fuzz.ts",
          };

          assert.deepStrictEqual(_msgNamed(lines), expected);
        });

        it("handles 3 files in subdirectories but does not show the directory paths", function () {
          const lines = [
            "A    baz.txt",
            "A    fizz/bar.js",
            "A    fizz/fuzz.md",
          ];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.FEAT,
            description: "create baz.txt, bar.js and fuzz.md",
          };

          assert.deepStrictEqual(_msgNamed(lines), expected);
        });

        /* eslint-disable-next-line quotes */
        it('handles 2 "build(deps)" files correctly', function () {
          const lines = ["M    package.json", "M     package-lock.json"];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.BUILD_DEPENDENCIES,
            description: "update package.json and package-lock.json",
          };

          assert.deepStrictEqual(_msgNamed(lines), expected);
        });

        it("handles 3 README.md files in different locations as full paths", function () {
          const lines = [
            "M    docs/README.md",
            "M    bar/README.md",
            "M    README.md",
          ];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.DOCS,
            description: "update docs/README.md, bar/README.md and README.md",
          };

          assert.deepStrictEqual(_msgNamed(lines), expected);
        });
      });

      describe("multiple files with different actions", function () {
        it("handles 2 files - one created and one modified", function () {
          const lines = ["A    baz.txt", "M    bar.js"];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 1 file and update 1 file",
          };

          assert.deepStrictEqual(_msgNamed(lines), expected);
        });

        it("handles 3 files - with different actions", function () {
          const lines = ["A    baz.txt", "M    bar.js", "D    README.md"];

          const expected = {
            prefixType: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 1 file, update 1 file and delete 1 file",
          };

          assert.deepStrictEqual(_msgNamed(lines), expected);
        });
      });
    });
  });

  describe("#_msgCount", function () {
    describe("single file changes", function () {
      // TODO: Use file name for single file. PR #52.
      it("handles a single file change", function () {
        const lines = ["A    baz.txt"];
        const expected = {
          prefixType: CONVENTIONAL_TYPE.UNKNOWN,
          description: "create 1 file",
        };

        assert.deepStrictEqual(_msgCount(lines), expected);
      });
    });

    describe("multiple files", function () {
      describe("multiple files with the same action", function () {
        // Don't need to distinguish between a few or many files as as it supposed to work the
        // same.

        it("handles 2 created files created correctly", function () {
          const lines = [
            "A    foo.txt",
            "A    bar.txt",
            "A    bazz.txt",
            "A    fizz.txt",
            "A    buzz.txt",
          ];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 5 files",
          };

          assert.deepStrictEqual(_msgCount(lines), expected);
        });

        it("handles 5 created files created correctly", function () {
          const lines = [
            "A    foo.txt",
            "A    bar.txt",
            "A    bazz.txt",
            "A    fizz.txt",
            "A    buzz.txt",
          ];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 5 files",
          };

          assert.deepStrictEqual(_msgCount(lines), expected);
        });

        it("handles 5 modified files correctly", function () {
          const lines = [
            "M    foo.txt",
            "M    bar.txt",
            "M    bazz.txt",
            "M    fizz.txt",
            "M    buzz.txt",
          ];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.UNKNOWN,
            description: "update 5 files",
          };

          assert.deepStrictEqual(_msgCount(lines), expected);
        });
      });

      describe("multiple files with different actions", function () {
        it("handles 2 files with 2 actions", function () {
          const lines = ["A    baz.txt", "M    bar.js"];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 1 file and update 1 file",
          };

          assert.deepStrictEqual(_msgCount(lines), expected);
        });

        it("handles 5 files with 2 actions", function () {
          const lines = [
            "A    baz.txt",
            "M    bar.js",
            "M    bazz.txt",
            "M    fizz.txt",
            "M    buzz.txt",
          ];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 1 file and update 4 files",
          };

          assert.deepStrictEqual(_msgCount(lines), expected);
        });

        it("handles 5 files with 3 different actions", function () {
          const lines = [
            "A    baz.txt",
            "M    bar.js",
            "D    README.md",
            "A    fizz.txt",
            "D    buzz.txt",
          ];

          const expected = {
            prefixType: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 2 files, update 1 file and delete 2 files",
          };

          assert.deepStrictEqual(_msgCount(lines), expected);
        });
      });
    });
  });

  describe("#_msgFromChanges", function () {
    describe("single file changes", function () {
      it("handles a single file correctly", function () {
        const lines = ["A    baz.txt"];
        const expected = {
          prefixType: CONVENTIONAL_TYPE.FEAT,
          description: "create baz.txt",
        };

        assert.deepStrictEqual(_msgFromChanges(lines), expected);
      });
    });

    describe("a few files", function () {
      describe("multiple files with the same action", function () {
        it("handles 2 created files created correctly", function () {
          const lines = ["A    baz.txt", "A    bar.js"];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.FEAT,
            description: "create baz.txt and bar.js",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        it("handles 2 modified files correctly", function () {
          const lines = ["M    baz.txt", "M    bar.js"];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.UNKNOWN,
            description: "update baz.txt and bar.js",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        it("handles 3 files with the same action correctly", function () {
          const lines = ["A    baz.txt", "A    bar.js", "A    fizz/fuzz.md"];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.FEAT,
            description: "create baz.txt, bar.js and fuzz.md",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        it("handles 4 files with the same action correctly", function () {
          const lines = [
            "A    baz.txt",
            "A    bar.js",
            "A    fuzz.md",
            "A    fuzz.ts",
          ];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.FEAT,
            description: "create baz.txt, bar.js, fuzz.md and fuzz.ts",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        it("handles 3 files in subdirectories but does not show the directory paths", function () {
          const lines = [
            "A    baz.txt",
            "A    fizz/bar.js",
            "A    fizz/fuzz.md",
          ];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.FEAT,
            description: "create baz.txt, bar.js and fuzz.md",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        /* eslint-disable-next-line quotes */
        it('handles 2 "build(deps)" files correctly', function () {
          const lines = ["M    package.json", "M     package-lock.json"];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.BUILD_DEPENDENCIES,
            description: "update package.json and package-lock.json",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        it("handles 3 README.md files in different locations as full paths", function () {
          const lines = [
            "M    docs/README.md",
            "M    bar/README.md",
            "M    README.md",
          ];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.DOCS,
            description: "update docs/README.md, bar/README.md and README.md",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });
      });

      describe("multiple files with different actions", function () {
        it("handles 2 files - one created and one modified", function () {
          const lines = ["A    baz.txt", "M    bar.js"];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 1 file and update 1 file",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        it("handles 3 files - with different actions", function () {
          const lines = ["A    baz.txt", "M    bar.js", "D    README.md"];

          const expected = {
            prefixType: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 1 file, update 1 file and delete 1 file",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });
      });
    });

    describe("many files", function () {
      describe("multiple files with the same action", function () {
        it("handles 5 created files created correctly", function () {
          const lines = [
            "A    foo.txt",
            "A    bar.txt",
            "A    bazz.txt",
            "A    fizz.txt",
            "A    buzz.txt",
          ];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 5 files",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        it("handles 5 modified files correctly", function () {
          const lines = [
            "M    foo.txt",
            "M    bar.txt",
            "M    bazz.txt",
            "M    fizz.txt",
            "M    buzz.txt",
          ];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.UNKNOWN,
            description: "update 5 files",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });
      });

      describe("multiple files with different actions", function () {
        it("handles 5 files with 2 actions", function () {
          const lines = [
            "A    baz.txt",
            "M    bar.js",
            "M    bazz.txt",
            "M    fizz.txt",
            "M    buzz.txt",
          ];
          const expected = {
            prefixType: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 1 file and update 4 files",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        it("handles 5 files with 3 different actions", function () {
          const lines = [
            "A    baz.txt",
            "M    bar.js",
            "D    README.md",
            "A    fizz.txt",
            "D    buzz.txt",
          ];

          const expected = {
            prefixType: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 2 files, update 1 file and delete 2 files",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });
      });
    });
  });

  describe("#_formatMsg", function () {
    it("combines a prefix and message correctly", function () {
      assert.strictEqual(
        _formatMsg({
          prefixType: CONVENTIONAL_TYPE.FEAT,
          description: "create foo.txt",
        }),
        "feat: create foo.txt"
      );

      assert.strictEqual(
        _formatMsg({
          prefixType: CONVENTIONAL_TYPE.BUILD,
          description: "update foo.txt",
        }),
        "build: update foo.txt"
      );

      assert.strictEqual(
        _formatMsg({
          prefixType: CONVENTIONAL_TYPE.DOCS,
          description: "update README.md",
        }),
        "docs: update README.md"
      );
    });
  });

  describe("#_newMsg", function () {
    describe("creates a new message from a prefix and message", function () {
      describe("single change", function () {
        it("handles a single created file", function () {
          assert.strictEqual(_newMsg(["A    baz.txt"]), "feat: create baz.txt");
        });
      });

      describe("multiple changes", function () {
        // Leave the detailed cases to tests for `_msgFromChanges`.
        const lines = ["A    baz.txt", "A    bar.js"];
        const expected = "feat: create baz.txt and bar.js";

        it("handles 2 created files", function () {
          assert.strictEqual(_newMsg(lines), expected);
        });

        it("handles 3 created files", function () {
          const lines = ["A    baz.txt", "A    bar.js", "A    fizz/fuzz.md"];
          const expected = "feat: create baz.txt, bar.js and fuzz.md";

          assert.strictEqual(_newMsg(lines), expected);
        });

        it("handles 3 created docs", function () {
          const lines = [
            "M    docs/README.md",
            "M    bar/README.md",
            "M    README.md",
          ];
          const expected =
            "docs: update docs/README.md, bar/README.md and README.md";
          assert.strictEqual(_newMsg(lines), expected);
        });
      });
    });
  });

  describe("#_combineOldAndNew", function () {
    describe("handles common scenarios correctly", function () {
      it("keeps the old message's type, if none can be inferred", function () {
        const oldMsg = "docs:";

        assert.strictEqual(
          _combineOldAndNew(
            CONVENTIONAL_TYPE.UNKNOWN,
            "update prepareCommitMsg.ts",
            oldMsg
          ),
          "docs: update prepareCommitMsg.ts"
        );
      });

      it("keeps the old description", function () {
        // TODO: Make the order of the description pieces should be switched to
        //    be more natural. e.g. 'update .editorconfig - xyz'
        // TODO: If the message is the same, don't add to it. i.e. Don't want
        //    to get 'chore: update.editorconfig update .editorconfig'
        const oldMsg = "xyz";

        assert.strictEqual(
          _combineOldAndNew(
            CONVENTIONAL_TYPE.CHORE,
            "update .editorconfig",
            oldMsg
          ),
          "chore: update .editorconfig xyz"
        );
      });

      it("uses a generated description, but keeps the type from the old message", function () {
        // In this example, say editing a comment in a config file and entering
        // type as docs and keeping that value instead of a generated one.
        const oldMsg = "docs:";

        assert.strictEqual(
          _combineOldAndNew(
            CONVENTIONAL_TYPE.CHORE,
            "update .editorconfig",
            oldMsg
          ),
          "docs: update .editorconfig"
        );
      });

      it("combines an old custom prefix and type with a new description", function () {
        const oldMsg = "[abc] docs:";
        assert.strictEqual(
          _combineOldAndNew(
            CONVENTIONAL_TYPE.CHORE,
            "update .editorconfig",
            oldMsg
          ),
          "[abc] docs: update .editorconfig"
        );
      });
    });

    describe("use the new message only, if the old message is empty", function () {
      it("handles implied old message", function () {
        assert.strictEqual(
          _combineOldAndNew(CONVENTIONAL_TYPE.UNKNOWN, "foo bar"),
          "foo bar"
        );

        assert.strictEqual(
          _combineOldAndNew(CONVENTIONAL_TYPE.FEAT, "foo bar"),
          "feat: foo bar"
        );
      });

      it("handles an explicit old message", function () {
        const oldMsg = "";

        assert.strictEqual(
          _combineOldAndNew(CONVENTIONAL_TYPE.FEAT, "foo bar", oldMsg),
          "feat: foo bar"
        );
      });
    });

    describe("combines an old message with a new message", function () {
      // Using '[ABCD-1234]' as a Jira ticket number. A branch or project name
      // works too.

      describe("when convention prefix cannot be determined from the file changes", function () {
        it("combines two plain messages", function () {
          assert.strictEqual(
            _combineOldAndNew(
              CONVENTIONAL_TYPE.UNKNOWN,
              "foo bar",
              "fizz buzz"
            ),
            "foo bar fizz buzz"
          );

          assert.strictEqual(
            _combineOldAndNew(
              CONVENTIONAL_TYPE.UNKNOWN,
              "foo bar",
              "[ABCD-1234]"
            ),
            "foo bar [ABCD-1234]"
          );
        });

        describe("combine a plain message and an existing prefix", function () {
          it("handles an old message that is just a type", function () {
            assert.strictEqual(
              _combineOldAndNew(CONVENTIONAL_TYPE.UNKNOWN, "foo bar", "feat:"),
              "feat: foo bar"
            );
          });

          it("handles an old message that a Jira identifier and a type", function () {
            assert.strictEqual(
              _combineOldAndNew(
                CONVENTIONAL_TYPE.UNKNOWN,
                "foo bar",
                "[ABCD-1234] feat:"
              ),
              "[ABCD-1234] feat: foo bar"
            );
          });

          describe("an old message that has a Jira identifier and no type", function () {
            // This behavior makes it easy to use the Git commit message
            // template and know for sure that the old message is a prefix
            // because of the colon, rather than a description.

            describe("with a space", function () {
              it("handles inferred chore type", function () {
                assert.strictEqual(
                  _combineOldAndNew(
                    CONVENTIONAL_TYPE.CHORE,
                    "foo the bar",
                    "[ABCD-1234] :"
                  ),
                  "[ABCD-1234] chore: foo the bar"
                );
              });

              it("handles inferred unknown type", function () {
                // Current behavior is unfortunately to drop the old message
                // completely, but this can be changed. One solution is
                // to remove unknown and always use feat/fix.
                assert.strictEqual(
                  _combineOldAndNew(
                    CONVENTIONAL_TYPE.UNKNOWN,
                    "foo the bar",
                    "[ABCD-1234] :"
                  ),
                  "foo the bar"
                );
              });
            });

            describe("with no space", function () {
              // This is not an intended case so wasn't designed for, so
              // this is just a test for completeness.
              assert.strictEqual(
                _combineOldAndNew(
                  CONVENTIONAL_TYPE.CHORE,
                  "foo the bar",
                  "[ABCD-1234]:"
                ),
                "[ABCD-1234]: foo the bar"
              );
            });
          });
        });

        it("combines a plain message and an existing prefix with a space after it", function () {
          assert.strictEqual(
            _combineOldAndNew(CONVENTIONAL_TYPE.UNKNOWN, "foo bar", "feat: "),
            "feat: foo bar"
          );

          assert.strictEqual(
            _combineOldAndNew(
              CONVENTIONAL_TYPE.UNKNOWN,
              "foo bar",
              "[ABCD-1234] feat: "
            ),
            "[ABCD-1234] feat: foo bar"
          );
        });

        describe("when the result is identical to the old message, don't duplicate", function () {
          it("adds a inferred type if it has one", function () {
            assert.strictEqual(
              _combineOldAndNew(
                CONVENTIONAL_TYPE.CHORE,
                "fizz buzz",
                "fizz buzz"
              ),
              "chore: fizz buzz"
            );
          });

          it("does nothing when there are no types to work with", function () {
            assert.strictEqual(
              _combineOldAndNew(
                CONVENTIONAL_TYPE.UNKNOWN,
                "fizz buzz",
                "fizz buzz"
              ),
              "fizz buzz"
            );
          });

          it("ignores a new type if the old one is set", function () {
            assert.strictEqual(
              _combineOldAndNew(
                CONVENTIONAL_TYPE.CHORE,
                "fizz buzz",
                "docs: fizz buzz"
              ),
              "docs: fizz buzz"
            );
          });
        });
      });

      describe("when a convention is determined from the file changes", function () {
        const autoType = CONVENTIONAL_TYPE.FEAT;
        const autoDesc = "foo bar";

        describe("with no old type, insert a new type between the old and new msg", function () {
          it("uses a plain old message", function () {
            const oldMsg = "fizz buzz";

            assert.strictEqual(
              _combineOldAndNew(autoType, autoDesc, oldMsg),
              "feat: foo bar fizz buzz"
            );
          });

          it("uses an old message that is a Jira number only", function () {
            // We could put old message at the start in the result.
            // The tricky bit is figuring out if the old message belongs after
            // the prefix as 'feat: OLD_MESSAGE NEW_MESSAGE', or it belongs as a
            // prefix as 'OLD_MESSAGE feat: NEW_MESSAGE'.
            // So that's why it's easiest just to always put the old message at
            // the end. One could look for hard brackets or all caps, but
            // sometimes a dev might use a project name instead.
            const oldMsg = "ABCD-1234";

            assert.strictEqual(
              _combineOldAndNew(autoType, autoDesc, oldMsg),
              "feat: foo bar ABCD-1234"
            );
          });
        });

        describe("keep the old type if there is one, without using a generated type", function () {
          it("uses a plain old message", function () {
            const oldMsg = "docs:";

            assert.strictEqual(
              _combineOldAndNew(autoType, autoDesc, oldMsg),
              "docs: foo bar"
            );
          });

          it("handles an old message that is Jira number plus a convention type", function () {
            const oldMsg = "[ABCD-1234] docs:";
            assert.strictEqual(
              _combineOldAndNew(autoType, autoDesc, oldMsg),
              "[ABCD-1234] docs: foo bar"
            );
          });
        });

        it("inserts replaces an old prefix with a space with a new one", function () {
          let oldMsg = "docs:";

          assert.strictEqual(
            _combineOldAndNew(autoType, autoDesc, oldMsg),
            "docs: foo bar"
          );

          oldMsg = "[ABCD-1234] docs: ";
          assert.strictEqual(
            _combineOldAndNew(autoType, autoDesc, oldMsg),
            "[ABCD-1234] docs: foo bar"
          );
        });
      });
    });
  });

  describe("#_generateMsgWithOld", function () {
    const fileChanges = ["M    baz.txt", "M    bar.js"];

    it("handles a set old message", function () {
      const oldMsg = "my old message";

      assert.strictEqual(
        _generateMsgWithOld(fileChanges, oldMsg),
        "update baz.txt and bar.js my old message"
      );
    });

    it("handles an empty old message", function () {
      const oldMsg = "";

      assert.throws(() => _generateMsgWithOld(fileChanges, oldMsg));
    });
  });

  describe("#generateMsg", function () {
    const fileChanges = ["M    baz.txt", "M    bar.js"];

    it("handles a set old message", function () {
      const oldMsg = "my old message";

      assert.strictEqual(
        generateMsg(fileChanges, oldMsg),
        "update baz.txt and bar.js my old message"
      );
    });

    it("handles an empty old message", function () {
      const oldMsg = "";

      assert.strictEqual(
        generateMsg(fileChanges, oldMsg),
        "update baz.txt and bar.js"
      );
    });
  });
});
