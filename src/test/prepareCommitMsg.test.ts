/**
 * Prepare commit message test module.
 *
 * Check creation of commit message.
 */
import * as assert from "assert";
import { MsgPieces } from "../generate/parseExisting.d";
import { CONVENTIONAL_TYPE } from "../lib/constants";
import {
  _collapse,
  _combineOldAndNew,
  _formatMsg,
  _generateMsgWithOld,
  _joinOldAndNew,
  _joinWithSpace,
  _msgCount,
  _msgFromChanges,
  _msgNamed,
  _newMsg,
  _prefixFromChange,
  generateMsg,
} from "../prepareCommitMsg";
import { ConvCommitMsg } from "../prepareCommitMsg.d";

describe("Join strings cleanly", function () {
  describe("#_joinWithSpace", function () {
    it("joins two set strings", function () {
      assert.strictEqual(_joinWithSpace("abc", "def"), "abc def");
      assert.strictEqual(_joinWithSpace(" abc", "def "), "abc def");
    });

    it("uses the first string if the second is not set", function () {
      assert.strictEqual(_joinWithSpace("abc", ""), "abc");
      assert.strictEqual(_joinWithSpace("abc ", ""), "abc");
    });

    it("uses the second string if the first is not set", function () {
      assert.strictEqual(_joinWithSpace("", "abc def"), "abc def");
      assert.strictEqual(_joinWithSpace("", "abc def "), "abc def");
    });

    it("returns the first string if they are identical, ignoring spaces", function () {
      assert.strictEqual(_joinWithSpace("abc def", "abc def"), "abc def");
      assert.strictEqual(_joinWithSpace("abc def", " abc def "), "abc def");
    });
  });
});

describe("Find prefix from Git output", function () {
  describe("#_prefixFromChange", function () {
    describe("generic file", function () {
      it("recognizes a new generic file as a feature", function () {
        assert.strictEqual(
          _prefixFromChange("A\tfoo.txt"),
          CONVENTIONAL_TYPE.FEAT,
        );

        assert.strictEqual(
          _prefixFromChange("A\tfoo bar.txt"),
          CONVENTIONAL_TYPE.FEAT,
        );
      });

      it("recognizes a modified generic file as an unknown", function () {
        assert.strictEqual(
          _prefixFromChange("M\tfoo.txt"),
          CONVENTIONAL_TYPE.UNKNOWN,
        );
      });

      it("recognizes a deleted generic file as a chore", function () {
        assert.strictEqual(
          _prefixFromChange("D\tfoo.txt"),
          CONVENTIONAL_TYPE.CHORE,
        );
      });

      it("recognizes a renamed generic file as a chore", function () {
        assert.strictEqual(
          _prefixFromChange("R\tfoo.txt bar.txt"),
          CONVENTIONAL_TYPE.CHORE,
        );
      });

      it("recognizes a moved generic file as a chore", function () {
        assert.strictEqual(
          _prefixFromChange("R\tfoo.txt bar/foo.txt"),
          CONVENTIONAL_TYPE.CHORE,
        );
      });
    });

    describe("categorized file change", function () {
      // Don't need to cover every type here - just docs should be fine.

      it("recognizes a new docs file change as docs", function () {
        const expected = CONVENTIONAL_TYPE.DOCS;

        assert.strictEqual(_prefixFromChange("A\tREADME.md"), expected);
        assert.strictEqual(_prefixFromChange("A\tdocs/abc.md"), expected);
      });

      it("recognizes an updated docs file change as docs", function () {
        const expected = CONVENTIONAL_TYPE.DOCS;

        assert.strictEqual(_prefixFromChange("M\tREADME.md"), expected);
        assert.strictEqual(_prefixFromChange("M\tdocs/foo.md"), expected);
      });

      it("recognizes a deleted docs file change as docs", function () {
        const expected = CONVENTIONAL_TYPE.DOCS;

        assert.strictEqual(_prefixFromChange("M\tREADME.md"), expected);
        assert.strictEqual(_prefixFromChange("M\tdocs/foo.md"), expected);
      });

      it("recognizes a renamed docs file change as chore", function () {
        const expected = CONVENTIONAL_TYPE.CHORE;

        assert.strictEqual(_prefixFromChange("R\tREADME.md\tbar.md"), expected);

        assert.strictEqual(
          _prefixFromChange("R\tdocs/foo.md\tdocs/bar.md"),
          expected,
        );
      });
      it("recognizes a moved docs file change as chore", function () {
        const expected = CONVENTIONAL_TYPE.CHORE;

        assert.strictEqual(
          _prefixFromChange("R\tREADME.md\tbar/README.md"),
          expected,
        );
        assert.strictEqual(
          _prefixFromChange("R\tdocs/foo.md\tbar/foo.md"),
          expected,
        );
      });
    });

    describe("categorized file change with scope", function () {
      it("recognizes a new build deps file change as build deps", function () {
        const expected = CONVENTIONAL_TYPE.BUILD_DEPENDENCIES;

        assert.strictEqual(_prefixFromChange("A\tpackage-lock.json"), expected);
      });

      it("recognizes an updated build deps file change as build deps", function () {
        const expected = CONVENTIONAL_TYPE.BUILD_DEPENDENCIES;

        assert.strictEqual(_prefixFromChange("M\tpackage-lock.json"), expected);
      });

      it("recognizes a renamed build deps file change as chore", function () {
        const expected = CONVENTIONAL_TYPE.CHORE;

        assert.strictEqual(
          _prefixFromChange("R\tpackage-lock.json\tfoo.json"),
          expected,
        );
      });

      it("recognizes a moved build deps file change as chore", function () {
        const expected = CONVENTIONAL_TYPE.CHORE;

        assert.strictEqual(
          _prefixFromChange("R\tpackage-lock.json\tfoo/package-lock.json"),
          expected,
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
        expected,
      );

      assert.strictEqual(
        _collapse([
          CONVENTIONAL_TYPE.FEAT,
          CONVENTIONAL_TYPE.FEAT,
          CONVENTIONAL_TYPE.FEAT,
        ]),
        expected,
      );
    });

    it("returns unknown when items differ", function () {
      const expected = CONVENTIONAL_TYPE.UNKNOWN;

      assert.strictEqual(
        _collapse([CONVENTIONAL_TYPE.FEAT, CONVENTIONAL_TYPE.DOCS]),
        expected,
      );

      assert.strictEqual(
        _collapse([
          CONVENTIONAL_TYPE.FEAT,
          CONVENTIONAL_TYPE.DOCS,
          CONVENTIONAL_TYPE.CHORE,
        ]),
        expected,
      );
    });

    it("uses build deps change if at least one is present", function () {
      const expected = CONVENTIONAL_TYPE.BUILD_DEPENDENCIES;
      assert.strictEqual(
        _collapse([
          CONVENTIONAL_TYPE.FEAT,
          CONVENTIONAL_TYPE.BUILD_DEPENDENCIES,
        ]),
        expected,
      );
      assert.strictEqual(
        _collapse([
          CONVENTIONAL_TYPE.FEAT,
          CONVENTIONAL_TYPE.BUILD_DEPENDENCIES,
          CONVENTIONAL_TYPE.CHORE,
        ]),
        expected,
      );
    });
  });
});

describe("Prepare commit message", function () {
  describe("#_msgNamed", function () {
    describe("single file changes", function () {
      it("handles a single file change", function () {
        const lines = ["A\tbaz.txt"];
        const expected = {
          typePrefix: CONVENTIONAL_TYPE.FEAT,
          description: "create baz.txt",
        };

        assert.deepStrictEqual(_msgNamed(lines), expected);
      });
    });

    describe("a few files", function () {
      describe("multiple files with the same action", function () {
        it("handles 2 created files created correctly", function () {
          const lines = ["A\tbaz.txt", "A\tbar.js"];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.FEAT,
            description: "create baz.txt and bar.js",
          };

          assert.deepStrictEqual(_msgNamed(lines), expected);
        });

        it("handles 2 modified files correctly", function () {
          const lines = ["M\tbaz.txt", "M\tbar.js"];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
            description: "update baz.txt and bar.js",
          };

          assert.deepStrictEqual(_msgNamed(lines), expected);
        });

        it("handles 3 files with the same action correctly", function () {
          const lines = ["A\tbaz.txt", "A\tbar.js", "A\tfizz/fuzz.md"];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.FEAT,
            description: "create baz.txt, bar.js and fuzz.md",
          };

          assert.deepStrictEqual(_msgNamed(lines), expected);
        });

        it("handles 4 files with the same action correctly", function () {
          const lines = ["A\tbaz.txt", "A\tbar.js", "A\tfuzz.md", "A\tfuzz.ts"];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.FEAT,
            description: "create baz.txt, bar.js, fuzz.md and fuzz.ts",
          };

          assert.deepStrictEqual(_msgNamed(lines), expected);
        });

        it("handles 3 files in subdirectories but does not show the directory paths", function () {
          const lines = ["A\tbaz.txt", "A\tfizz/bar.js", "A\tfizz/fuzz.md"];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.FEAT,
            description: "create baz.txt, bar.js and fuzz.md",
          };

          assert.deepStrictEqual(_msgNamed(lines), expected);
        });

        it("handles 3 README.md files in different locations as full paths", function () {
          {
            const lines = [
              "M\tdocs/README.md",
              "M\tbar/README.md",
              "M\tREADME.md",
            ];
            const expected = {
              typePrefix: CONVENTIONAL_TYPE.DOCS,
              description: "update docs/README.md, bar/README.md and README.md",
            };

            assert.deepStrictEqual(_msgNamed(lines), expected);
          }

          {
            const lines = [
              "M\tdocs/README.md",
              "M\tbar buzz/README.md",
              "M\tREADME.md",
            ];
            const expected = {
              typePrefix: CONVENTIONAL_TYPE.DOCS,
              description:
                "update docs/README.md, 'bar buzz/README.md' and README.md",
            };

            assert.deepStrictEqual(_msgNamed(lines), expected);
          }
        });

        /* eslint-disable-next-line quotes */
        it('handles 2 "build(deps)" files correctly', function () {
          const lines = ["M\tpackage.json", "M\tpackage-lock.json"];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.BUILD_DEPENDENCIES,
            description: "update package.json and package-lock.json",
          };

          assert.deepStrictEqual(_msgNamed(lines), expected);
        });

      });

      describe("multiple files with different actions", function () {
        it("handles 2 files - one created and one modified", function () {
          const lines = ["A\tbaz.txt", "M\tbar.js"];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 1 file and update 1 file",
          };

          assert.deepStrictEqual(_msgNamed(lines), expected);
        });

        it("handles 3 files - with different actions", function () {
          const lines = ["A\tbaz.txt", "M\tbar.js", "D\tREADME.md"];

          const expected = {
            typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
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
        const lines = ["A\tbaz.txt"];
        const expected = {
          typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
          description: "create 1 file",
        };

        assert.deepStrictEqual(_msgCount(lines), expected);
      });
    });

    describe("multiple files", function () {
      describe("multiple files with the same action", function () {
        // Don't need to distinguish between a few or many files as as it
        // supposed to work the same.

        it("handles 2 created files created correctly", function () {
          const lines = [
            "A\tfoo.txt",
            "A\tbar.txt",
            "A\tbazz.txt",
            "A\tfizz.txt",
            "A\tbuzz.txt",
          ];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 5 files",
          };

          assert.deepStrictEqual(_msgCount(lines), expected);
        });

        it("handles 5 created files created correctly", function () {
          const lines = [
            "A\tfoo.txt",
            "A\tbar.txt",
            "A\tbazz.txt",
            "A\tfizz.txt",
            "A\tbuzz.txt",
          ];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 5 files",
          };

          assert.deepStrictEqual(_msgCount(lines), expected);
        });

        it("handles 5 modified files correctly", function () {
          const lines = [
            "M\tfoo.txt",
            "M\tbar.txt",
            "M\tbazz.txt",
            "M\tfizz.txt",
            "M\tbuzz.txt",
          ];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
            description: "update 5 files",
          };

          assert.deepStrictEqual(_msgCount(lines), expected);
        });
      });

      describe("multiple files with different actions", function () {
        it("handles 2 files with 2 actions", function () {
          const lines = ["A\tbaz.txt", "M\tbar.js"];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 1 file and update 1 file",
          };

          assert.deepStrictEqual(_msgCount(lines), expected);
        });

        it("handles 5 files with 2 actions", function () {
          const lines = [
            "A\tbaz.txt",
            "M\tbar.js",
            "M\tbazz.txt",
            "M\tfizz.txt",
            "M\tbuzz.txt",
          ];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 1 file and update 4 files",
          };

          assert.deepStrictEqual(_msgCount(lines), expected);
        });

        it("handles 5 files with 3 different actions", function () {
          const lines = [
            "A\tbaz.txt",
            "M\tbar.js",
            "D\tREADME.md",
            "A\tfizz.txt",
            "D\tbuzz.txt",
          ];

          const expected = {
            typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
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
        const lines = ["A\tbaz.txt"];
        const expected = {
          typePrefix: CONVENTIONAL_TYPE.FEAT,
          description: "create baz.txt",
        };

        assert.deepStrictEqual(_msgFromChanges(lines), expected);
      });
    });

    describe("a few files", function () {
      describe("multiple files with the same action", function () {
        it("handles 2 created files created correctly", function () {
          const lines = ["A\tbaz.txt", "A\tbar.js"];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.FEAT,
            description: "create baz.txt and bar.js",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        it("handles 2 modified files correctly", function () {
          const lines = ["M\tbaz.txt", "M\tbar.js"];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
            description: "update baz.txt and bar.js",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        it("handles 3 files with the same action correctly", function () {
          const lines = ["A\tbaz.txt", "A\tbar.js", "A\tfizz/fuzz.md"];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.FEAT,
            description: "create baz.txt, bar.js and fuzz.md",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        it("handles 4 files with the same action correctly", function () {
          const lines = ["A\tbaz.txt", "A\tbar.js", "A\tfuzz.md", "A\tfuzz.ts"];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.FEAT,
            description: "create baz.txt, bar.js, fuzz.md and fuzz.ts",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        it("handles 3 files in subdirectories but does not show the directory paths", function () {
          const lines = ["A\tbaz.txt", "A\tfizz/bar.js", "A\tfizz/fuzz.md"];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.FEAT,
            description: "create baz.txt, bar.js and fuzz.md",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        /* eslint-disable-next-line quotes */
        it('handles 2 "build(deps)" files correctly', function () {
          const lines = ["M\tpackage.json", "M\tpackage-lock.json"];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.BUILD_DEPENDENCIES,
            description: "update package.json and package-lock.json",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        it("handles 3 README.md files in different locations as full paths", function () {
          const lines = [
            "M\tdocs/README.md",
            "M\tbar/README.md",
            "M\tREADME.md",
          ];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.DOCS,
            description: "update docs/README.md, bar/README.md and README.md",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });
      });

      describe("multiple files with different actions", function () {
        it("handles 2 files - one created and one modified", function () {
          const lines = ["A\tbaz.txt", "M\tbar.js"];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 1 file and update 1 file",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        it("handles 3 files - with different actions", function () {
          const lines = ["A\tbaz.txt", "M\tbar.js", "D\tREADME.md"];

          const expected = {
            typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
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
            "A\tfoo.txt",
            "A\tbar.txt",
            "A\tbazz.txt",
            "A\tfizz.txt",
            "A\tbuzz.txt",
          ];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 5 files",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        it("handles 5 modified files correctly", function () {
          const lines = [
            "M\tfoo.txt",
            "M\tbar.txt",
            "M\tbazz.txt",
            "M\tfizz.txt",
            "M\tbuzz.txt",
          ];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
            description: "update 5 files",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });
      });

      describe("multiple files with different actions", function () {
        it("handles 5 files with 2 actions", function () {
          const lines = [
            "A\tbaz.txt",
            "M\tbar.js",
            "M\tbazz.txt",
            "M\tfizz.txt",
            "M\tbuzz.txt",
          ];
          const expected = {
            typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
            description: "create 1 file and update 4 files",
          };

          assert.deepStrictEqual(_msgFromChanges(lines), expected);
        });

        it("handles 5 files with 3 different actions", function () {
          const lines = [
            "A\tbaz.txt",
            "M\tbar.js",
            "D\tREADME.md",
            "A\tfizz.txt",
            "D\tbuzz.txt",
          ];

          const expected = {
            typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
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
          typePrefix: CONVENTIONAL_TYPE.FEAT,
          description: "create foo.txt",
        }),
        "feat: create foo.txt",
      );

      assert.strictEqual(
        _formatMsg({
          typePrefix: CONVENTIONAL_TYPE.BUILD,
          description: "update foo.txt",
        }),
        "build: update foo.txt",
      );

      assert.strictEqual(
        _formatMsg({
          typePrefix: CONVENTIONAL_TYPE.DOCS,
          description: "update README.md",
        }),
        "docs: update README.md",
      );
    });
  });

  describe("#_newMsg", function () {
    describe("creates a new message from a prefix and message", function () {
      describe("single change", function () {
        it("handles a single created file", function () {
          assert.strictEqual(_newMsg(["A\tbaz.txt"]), "feat: create baz.txt");
        });

        it("handles a single created file with special characters", function () {
          assert.strictEqual(
            _newMsg(["A\tspëcial châracters.md"]),
            "feat: create 'spëcial châracters.md'",
          );
        });
      });

      describe("multiple changes", function () {
        // Leave the detailed cases to tests for `_msgFromChanges`.
        const lines = ["A\tbaz.txt", "A\tbar.js"];
        const expected = "feat: create baz.txt and bar.js";

        it("handles 2 created files", function () {
          assert.strictEqual(_newMsg(lines), expected);
        });

        it("handles 3 created files", function () {
          const lines = ["A\tbaz.txt", "A\tbar.js", "A\tfizz/fuzz.md"];
          const expected = "feat: create baz.txt, bar.js and fuzz.md";

          assert.strictEqual(_newMsg(lines), expected);
        });

        it("handles 3 created docs", function () {
          {
            const lines = [
              "M\tdocs/README.md",
              "M\tbar/README.md",
              "M\tREADME.md",
            ];
            const expected =
              "docs: update docs/README.md, bar/README.md and README.md";

            assert.strictEqual(_newMsg(lines), expected);
          }

          {
            const lines = [
              "M\tdocs/fizz buzz.md",
              "M\tbar/README.md",
              "M\tREADME.md",
            ];
            const expected =
              "docs: update 'fizz buzz.md', bar/README.md and README.md";

            assert.strictEqual(_newMsg(lines), expected);
          }
        });
      });
    });
  });

  describe("#_joinOldAndNew", function () {
    // Cases here are based on `_combineOldAndNew` because that function was
    // created from a refactor.

    describe("handles common scenarios correctly", function () {
      it("keeps the old message's type, if none can be inferred", function () {
        const autoMsgPieces: ConvCommitMsg = {
          typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
          description: "update prepareCommitMsg.ts",
        };
        const oldMsgPieces: MsgPieces = {
          customPrefix: "",
          typePrefix: "docs",
          description: "",
        };

        assert.strictEqual(
          _joinOldAndNew(autoMsgPieces, oldMsgPieces),
          "docs: update prepareCommitMsg.ts",
        );
      });

      it("keeps the old description", function () {
        const autoMsgPieces: ConvCommitMsg = {
          typePrefix: CONVENTIONAL_TYPE.CHORE,
          description: "update .editorconfig",
        };

        const oldMsgPieces: MsgPieces = {
          customPrefix: "",
          typePrefix: "chore",
          description: "foo the bar",
        };

        assert.strictEqual(
          _joinOldAndNew(autoMsgPieces, oldMsgPieces),
          "chore: update .editorconfig foo the bar",
        );
      });

      it("uses a generated description, but keeps the type from the old message", function () {
        const autoMsgPieces: ConvCommitMsg = {
          typePrefix: CONVENTIONAL_TYPE.CHORE,
          description: "update .editorconfig",
        };

        const oldMsgPieces: MsgPieces = {
          customPrefix: "",
          typePrefix: "docs",
          description: "",
        };

        assert.strictEqual(
          _joinOldAndNew(autoMsgPieces, oldMsgPieces),
          "docs: update .editorconfig",
        );
      });

      it("combines an old custom prefix and type with a new description", function () {
        const autoMsgPieces: ConvCommitMsg = {
          typePrefix: CONVENTIONAL_TYPE.CHORE,
          description: "update .editorconfig",
        };

        const oldMsgPieces: MsgPieces = {
          customPrefix: "[abc]",
          typePrefix: "docs",
          description: "",
        };

        assert.strictEqual(
          _joinOldAndNew(autoMsgPieces, oldMsgPieces),
          "[abc] docs: update .editorconfig",
        );
      });
    });

    describe("use the new message only, if the old message is empty", function () {
      it("handles an unknown type", function () {
        const autoMsgPieces: ConvCommitMsg = {
          typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
          description: "foo the bar",
        };
        const oldMsgPieces: MsgPieces = {
          customPrefix: "",
          typePrefix: "",
          description: "",
        };

        assert.strictEqual(
          _joinOldAndNew(autoMsgPieces, oldMsgPieces),
          "foo the bar",
        );
      });

      it("handles a known type", function () {
        const autoMsgPieces: ConvCommitMsg = {
          typePrefix: CONVENTIONAL_TYPE.FEAT,
          description: "foo the bar",
        };
        const oldMsgPieces: MsgPieces = {
          customPrefix: "",
          typePrefix: "",
          description: "",
        };

        assert.strictEqual(
          _joinOldAndNew(autoMsgPieces, oldMsgPieces),
          "feat: foo the bar",
        );
      });
    });

    describe("combines an old message with a new message", function () {
      describe("when type prefix cannot be determined from the file changes", function () {
        it("combines two plain messages", function () {
          {
            const autoMsgPieces = {
              typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
              description: "foo the bar",
            };
            const oldMsgPieces = {
              customPrefix: "",
              typePrefix: "",
              description: "fizz the buzz",
            };

            assert.strictEqual(
              _joinOldAndNew(autoMsgPieces, oldMsgPieces),
              "foo the bar fizz the buzz",
            );
          }

          {
            const autoMsgPieces = {
              typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
              description: "foo the bar",
            };
            const oldMsgPieces = {
              customPrefix: "",
              typePrefix: "",
              description: "[ABCD-1234]",
            };

            assert.strictEqual(
              _joinOldAndNew(autoMsgPieces, oldMsgPieces),
              "foo the bar [ABCD-1234]",
            );
          }
        });

        describe("combine a plain message and an existing prefix", function () {
          it("handles an old message that is just a type", function () {
            const autoMsgPieces = {
              typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
              description: "foo the bar",
            };
            const oldMsgPieces = {
              customPrefix: "",
              typePrefix: "feat",
              description: "",
            };

            assert.strictEqual(
              _joinOldAndNew(autoMsgPieces, oldMsgPieces),
              "feat: foo the bar",
            );
          });

          it("handles an old message that a Jira identifier and a type", function () {
            const autoMsgPieces = {
              typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
              description: "foo the bar",
            };
            const oldMsgPieces = {
              customPrefix: "[ABCD-1234]",
              typePrefix: "feat",
              description: "",
            };

            assert.strictEqual(
              _joinOldAndNew(autoMsgPieces, oldMsgPieces),
              "[ABCD-1234] feat: foo the bar",
            );
          });

          describe("an old message that has a Jira identifier and no type", function () {
            describe("with a space", function () {
              it("handles inferred chore type", function () {
                const autoMsgPieces = {
                  typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
                  description: "foo the bar",
                };
                const oldMsgPieces = {
                  customPrefix: "[ABCD-1234]",
                  typePrefix: "feat",
                  description: "",
                };

                assert.strictEqual(
                  _joinOldAndNew(autoMsgPieces, oldMsgPieces),
                  "[ABCD-1234] feat: foo the bar",
                );
              });

              it("handles inferred unknown type", function () {
                const autoMsgPieces = {
                  typePrefix: CONVENTIONAL_TYPE.CHORE,
                  description: "foo the bar",
                };
                const oldMsgPieces = {
                  customPrefix: "[ABCD-1234] ",
                  typePrefix: "",
                  description: "",
                };

                assert.strictEqual(
                  _joinOldAndNew(autoMsgPieces, oldMsgPieces),
                  "[ABCD-1234] chore: foo the bar",
                );
              });
            });

            describe("with no space", function () {
              it("handles inferred chore type", function () {
                const autoMsgPieces = {
                  typePrefix: CONVENTIONAL_TYPE.CHORE,
                  description: "foo the bar",
                };
                const oldMsgPieces = {
                  customPrefix: "[ABCD-1234]",
                  typePrefix: "feat",
                  description: "",
                };

                assert.strictEqual(
                  _joinOldAndNew(autoMsgPieces, oldMsgPieces),
                  "[ABCD-1234] feat: foo the bar",
                );
              });
            });
          });

          it("combines a plain message and an existing prefix with a space after it", function () {
            {
              const autoMsgPieces = {
                typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
                description: "foo the bar",
              };
              const oldMsgPieces = {
                customPrefix: "",
                typePrefix: "feat ",
                description: "",
              };

              assert.strictEqual(
                _joinOldAndNew(autoMsgPieces, oldMsgPieces),
                "feat: foo the bar",
              );
            }

            {
              const autoMsgPieces = {
                typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
                description: "foo the bar",
              };
              const oldMsgPieces = {
                customPrefix: "[ABCD-1234]",
                typePrefix: "feat ",
                description: "",
              };

              assert.strictEqual(
                _joinOldAndNew(autoMsgPieces, oldMsgPieces),
                "[ABCD-1234] feat: foo the bar",
              );
            }
          });

          describe("when the result is identical to the old message, don't duplicate", function () {
            it("adds a inferred type if it has one", function () {
              assert.strictEqual(
                _joinOldAndNew(
                  {
                    typePrefix: CONVENTIONAL_TYPE.CHORE,
                    description: "fizz the buzz",
                  },
                  {
                    customPrefix: "",
                    typePrefix: "",
                    description: "fizz the buzz",
                  },
                ),
                "chore: fizz the buzz",
              );
            });

            it("does nothing when there are no types to work with", function () {
              assert.strictEqual(
                _joinOldAndNew(
                  {
                    typePrefix: CONVENTIONAL_TYPE.UNKNOWN,
                    description: "fizz the buzz",
                  },
                  {
                    customPrefix: "",
                    typePrefix: "",
                    description: "fizz the buzz",
                  },
                ),
                "fizz the buzz",
              );
            });

            it("ignores a new type if the old one is set", function () {
              assert.strictEqual(
                _joinOldAndNew(
                  {
                    typePrefix: CONVENTIONAL_TYPE.CHORE,
                    description: "fizz the buzz",
                  },
                  {
                    customPrefix: "",
                    typePrefix: "docs",
                    description: "fizz the buzz",
                  },
                ),
                "docs: fizz the buzz",
              );
            });
          });
        });

        describe("when a convention is determined from the file changes", function () {
          const autoMsgPieces = {
            typePrefix: CONVENTIONAL_TYPE.FEAT,
            description: "foo the bar",
          };

          describe("with no old type, insert a new type between the old and new msg", function () {
            it("uses a plain old message", function () {
              const oldMsgPieces = {
                customPrefix: "",
                typePrefix: "",
                description: "fizz the buzz",
              };

              assert.strictEqual(
                _joinOldAndNew(autoMsgPieces, oldMsgPieces),
                "feat: foo the bar fizz the buzz",
              );
            });

            it("uses an old message that is a Jira number only", function () {
              const oldMsgPieces = {
                customPrefix: "",
                typePrefix: "",
                description: "ABCD-1234",
              };

              assert.strictEqual(
                _joinOldAndNew(autoMsgPieces, oldMsgPieces),
                "feat: foo the bar ABCD-1234",
              );
            });
          });

          describe("keep the old type if there is one, without using an auto type", function () {
            it("uses a plain old message", function () {
              const oldMsgPieces = {
                customPrefix: "",
                typePrefix: "docs",
                description: "",
              };

              assert.strictEqual(
                _joinOldAndNew(autoMsgPieces, oldMsgPieces),
                "docs: foo the bar",
              );
            });

            it("handles an old message that is Jira number plus a convention type", function () {
              const oldMsgPieces = {
                customPrefix: "[ABCD-1234]",
                typePrefix: "docs",
                description: "",
              };

              assert.strictEqual(
                _joinOldAndNew(autoMsgPieces, oldMsgPieces),
                "[ABCD-1234] docs: foo the bar",
              );
            });
          });

          it("inserts replaces an old prefix with a space with a new one", function () {
            {
              const oldMsgPieces = {
                customPrefix: "",
                typePrefix: "docs",
                description: "",
              };

              assert.strictEqual(
                _joinOldAndNew(autoMsgPieces, oldMsgPieces),
                "docs: foo the bar",
              );
            }

            {
              const oldMsgPieces = {
                customPrefix: "[ABCD-1234]",
                typePrefix: "docs",
                description: "",
              };

              assert.strictEqual(
                _joinOldAndNew(autoMsgPieces, oldMsgPieces),
                "[ABCD-1234] docs: foo the bar",
              );
            }
          });
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
            oldMsg,
          ),
          "docs: update prepareCommitMsg.ts",
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
            oldMsg,
          ),
          "chore: update .editorconfig xyz",
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
            oldMsg,
          ),
          "docs: update .editorconfig",
        );
      });

      it("combines an old custom prefix and type with a new description", function () {
        const oldMsg = "[abc] docs:";
        assert.strictEqual(
          _combineOldAndNew(
            CONVENTIONAL_TYPE.CHORE,
            "update .editorconfig",
            oldMsg,
          ),
          "[abc] docs: update .editorconfig",
        );
      });
    });

    describe("use the new message only, if the old message is empty", function () {
      it("handles an unknown type", function () {
        const oldMsg = "";

        assert.strictEqual(
          _combineOldAndNew(CONVENTIONAL_TYPE.UNKNOWN, "foo the bar", oldMsg),
          "foo the bar",
        );
      });

      it("handles a known type", function () {
        const oldMsg = "";

        assert.strictEqual(
          _combineOldAndNew(CONVENTIONAL_TYPE.FEAT, "foo the bar", oldMsg),
          "feat: foo the bar",
        );
      });
    });

    describe("combines an old message with a new message", function () {
      // Using '[ABCD-1234]' as a Jira ticket number. A branch or project name
      // works too.

      describe("when type prefix cannot be determined from the file changes", function () {
        it("combines two plain messages", function () {
          assert.strictEqual(
            _combineOldAndNew(
              CONVENTIONAL_TYPE.UNKNOWN,
              "foo the bar",
              "fizz the buzz",
            ),
            "foo the bar fizz the buzz",
          );

          assert.strictEqual(
            _combineOldAndNew(
              CONVENTIONAL_TYPE.UNKNOWN,
              "foo the bar",
              "[ABCD-1234]",
            ),
            "foo the bar [ABCD-1234]",
          );
        });

        describe("combine a plain message and an existing prefix", function () {
          it("handles an old message that is just a type", function () {
            assert.strictEqual(
              _combineOldAndNew(
                CONVENTIONAL_TYPE.UNKNOWN,
                "foo the bar",
                "feat:",
              ),
              "feat: foo the bar",
            );
          });

          it("handles an old message that a Jira identifier and a type", function () {
            assert.strictEqual(
              _combineOldAndNew(
                CONVENTIONAL_TYPE.UNKNOWN,
                "foo the bar",
                "[ABCD-1234] feat:",
              ),
              "[ABCD-1234] feat: foo the bar",
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
                    "[ABCD-1234] :",
                  ),
                  "[ABCD-1234] chore: foo the bar",
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
                    "[ABCD-1234] :",
                  ),
                  "foo the bar",
                );
              });
            });

            describe("with no space", function () {
              // This is not an intended case so wasn't designed for, so
              // this is just a test for completeness.
              it("handles inferred chore type", function () {
                assert.strictEqual(
                  _combineOldAndNew(
                    CONVENTIONAL_TYPE.CHORE,
                    "foo the bar",
                    "[ABCD-1234]:",
                  ),
                  "[ABCD-1234]: foo the bar",
                );
              });
            });
          });
        });

        it("combines a plain message and an existing prefix with a space after it", function () {
          assert.strictEqual(
            _combineOldAndNew(
              CONVENTIONAL_TYPE.UNKNOWN,
              "foo the bar",
              "feat: ",
            ),
            "feat: foo the bar",
          );

          assert.strictEqual(
            _combineOldAndNew(
              CONVENTIONAL_TYPE.UNKNOWN,
              "foo the bar",
              "[ABCD-1234] feat: ",
            ),
            "[ABCD-1234] feat: foo the bar",
          );
        });

        describe("when the result is identical to the old message, don't duplicate", function () {
          it("adds a inferred type if it has one", function () {
            assert.strictEqual(
              _combineOldAndNew(
                CONVENTIONAL_TYPE.CHORE,
                "fizz the buzz",
                "fizz the buzz",
              ),
              "chore: fizz the buzz",
            );
          });

          it("does nothing when there are no types to work with", function () {
            assert.strictEqual(
              _combineOldAndNew(
                CONVENTIONAL_TYPE.UNKNOWN,
                "fizz the buzz",
                "fizz the buzz",
              ),
              "fizz the buzz",
            );
          });

          it("ignores a new type if the old one is set", function () {
            assert.strictEqual(
              _combineOldAndNew(
                CONVENTIONAL_TYPE.CHORE,
                "fizz the buzz",
                "docs: fizz the buzz",
              ),
              "docs: fizz the buzz",
            );
          });
        });
      });

      describe("when a convention is determined from the file changes", function () {
        const autoType = CONVENTIONAL_TYPE.FEAT;
        const autoDesc = "foo the bar";

        describe("with no old type, insert a new type between the old and new msg", function () {
          it("uses a plain old message", function () {
            const oldMsg = "fizz the buzz";

            assert.strictEqual(
              _combineOldAndNew(autoType, autoDesc, oldMsg),
              "feat: foo the bar fizz the buzz",
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
              "feat: foo the bar ABCD-1234",
            );
          });
        });

        describe("keep the old type if there is one, without using an auto type", function () {
          it("uses a plain old message", function () {
            const oldMsg = "docs:";

            assert.strictEqual(
              _combineOldAndNew(autoType, autoDesc, oldMsg),
              "docs: foo the bar",
            );
          });

          it("handles an old message that is Jira number plus a convention type", function () {
            const oldMsg = "[ABCD-1234] docs:";
            assert.strictEqual(
              _combineOldAndNew(autoType, autoDesc, oldMsg),
              "[ABCD-1234] docs: foo the bar",
            );
          });
        });

        it("inserts replaces an old prefix with a space with a new one", function () {
          {
            const oldMsg = "docs:";

            assert.strictEqual(
              _combineOldAndNew(autoType, autoDesc, oldMsg),
              "docs: foo the bar",
            );
          }

          {
            const oldMsg = "[ABCD-1234] docs: ";
            assert.strictEqual(
              _combineOldAndNew(autoType, autoDesc, oldMsg),
              "[ABCD-1234] docs: foo the bar",
            );
          }
        });
      });
    });
  });

  describe("#_generateMsgWithOld", function () {
    const fileChanges = ["M\tbaz.txt", "M\tbar.js"];

    it("handles a set old message", function () {
      const oldMsg = "my old message";

      assert.strictEqual(
        _generateMsgWithOld(fileChanges, oldMsg),
        "update baz.txt and bar.js my old message",
      );
    });

    it("handles an empty old message", function () {
      const oldMsg = "";

      assert.throws(() => _generateMsgWithOld(fileChanges, oldMsg));
    });
  });

  describe("#generateMsg", function () {
    const fileChanges = ["M\tbaz.txt", "M\tbar.js"];

    it("handles a set old message", function () {
      const oldMsg = "my old message";

      assert.strictEqual(
        generateMsg(fileChanges, oldMsg),
        "update baz.txt and bar.js my old message",
      );
    });

    it("handles an empty old message", function () {
      const oldMsg = "";

      assert.strictEqual(
        generateMsg(fileChanges, oldMsg),
        "update baz.txt and bar.js",
      );
    });

    it("handles a single file change with a set old message", function () {
      const singleFileChange = ["M\tbaz.txt"];
      const oldMsg = "my old message";

      assert.strictEqual(
        generateMsg(singleFileChange, oldMsg),
        "update baz.txt my old message",
      );
    });

    it("handles a single file change with an empty old message", function () {
      const singleFileChange = ["M\tbaz.txt"];
      const oldMsg = "";

      assert.strictEqual(
        generateMsg(singleFileChange, oldMsg),
        "update baz.txt",
      );
    });

    it("handles multiple file changes with a set old message", function () {
      const multipleFileChanges = ["M\tbaz.txt", "M\tbar.js", "M\tfoo.txt"];
      const oldMsg = "my old message";

      assert.strictEqual(
        generateMsg(multipleFileChanges, oldMsg),
        "update baz.txt, bar.js and foo.txt my old message",
      );
    });

    it("handles multiple file changes with an empty old message", function () {
      const multipleFileChanges = ["M\tbaz.txt", "M\tbar.js", "M\tfoo.txt"];
      const oldMsg = "";

      assert.strictEqual(
        generateMsg(multipleFileChanges, oldMsg),
        "update baz.txt, bar.js and foo.txt",
      );
    });

    it("handles a single file change with special characters", function () {
      const singleFileChange = ["M\tspëcial châracters.md"];
      const oldMsg = "";

      assert.strictEqual(
        generateMsg(singleFileChange, oldMsg),
        "update 'spëcial châracters.md'",
      );
    });
  });
});
