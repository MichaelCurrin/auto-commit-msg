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
  _combineOldAndNew,
  _formatMsg,
  _generateMsgWithOld,
  _msgFromChanges,
  _newMsg,
  _splitMsg
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

describe("Split a message into components", function () {
  describe("#_splitMsg", function () {
    it("handles a description alone", function () {
      assert.deepStrictEqual(_splitMsg("abc def"), {
        customPrefix: "",
        typePrefix: "",
        description: "abc def",
      });
      assert.deepStrictEqual(_splitMsg("[ABCD-1234]"), {
        customPrefix: "",
        typePrefix: "",
        description: "[ABCD-1234]",
      });
    });

    it("handles a prefix alone", function () {
      assert.deepStrictEqual(_splitMsg("docs:"), {
        customPrefix: "",
        typePrefix: "docs",
        description: "",
      });
      assert.deepStrictEqual(_splitMsg("feat:"), {
        customPrefix: "",
        typePrefix: "feat",
        description: "",
      });

      assert.deepStrictEqual(_splitMsg("docs: "), {
        customPrefix: "",
        typePrefix: "docs",
        description: "",
      });
    });

    it("separates a prefix and description", function () {
      assert.deepStrictEqual(_splitMsg("docs: abc"), {
        customPrefix: "",
        typePrefix: "docs",
        description: "abc",
      });
      assert.deepStrictEqual(_splitMsg("docs: abc def"), {
        customPrefix: "",
        typePrefix: "docs",
        description: "abc def",
      });
      assert.deepStrictEqual(_splitMsg("feat: abc def"), {
        customPrefix: "",
        typePrefix: "feat",
        description: "abc def",
      });

      assert.deepStrictEqual(_splitMsg("[ABCD-1234] docs: abc def"), {
        customPrefix: "[ABCD-1234]",
        typePrefix: "docs",
        description: "abc def",
      });
    });
  });
});

describe("Prepare commit message", function () {
  describe("#_msgFromChanges", function () {
    describe("single file changes", function () {
      it("handles a single file correctly", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.FEAT,
          description: "create baz.txt",
        };

        assert.deepStrictEqual(_msgFromChanges(["A    baz.txt"]), expected);
      });
    });

    describe("multiple files with the same action", function () {
      it("handles 2 created files created correctly", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.FEAT,
          description: "create baz.txt and bar.js",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["A    baz.txt", "A    bar.js"]),
          expected
        );
      });

      it("handles 2 modified files correctly", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.UNKNOWN,
          description: "update baz.txt and bar.js",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["M    baz.txt", "M    bar.js"]),
          expected
        );
      });

      it("handles 3 files with the same action correctly", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.FEAT,
          description: "create baz.txt, bar.js and fuzz.md",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["A    baz.txt", "A    bar.js", "A    fizz/fuzz.md"]),
          expected
        );
      });

      it("handles 4 files with the same action correctly", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.FEAT,
          description: "create baz.txt, bar.js, fuzz.md and fuzz.ts",
        };

        assert.deepStrictEqual(
          _msgFromChanges([
            "A    baz.txt",
            "A    bar.js",
            "A    fuzz.md",
            "A    fuzz.ts",
          ]),
          expected
        );
      });

      it("handles 3 files in subdirectories but does not show the directory paths", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.FEAT,
          description: "create baz.txt, bar.js and fuzz.md",
        };

        assert.deepStrictEqual(
          _msgFromChanges([
            "A    baz.txt",
            "A    fizz/bar.js",
            "A    fizz/fuzz.md",
          ]),
          expected
        );
      });

      /* eslint-disable-next-line quotes */
      it('handles 2 "build(deps)" files correctly', function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.BUILD_DEPENDENCIES,
          description: "update package.json and package-lock.json",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["M    package.json", "M     package-lock.json"]),
          expected
        );
      });

      it("handles 3 README.md files in different locations as full paths", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.DOCS,
          description: "update docs/README.md, bar/README.md and README.md",
        };

        assert.deepStrictEqual(
          _msgFromChanges([
            "M    docs/README.md",
            "M    bar/README.md",
            "M    README.md",
          ]),
          expected
        );
      });
    });

    describe("multiple files with different actions", function () {
      it("handles 2 files - one created and one modified", function () {
        const expected = {
          prefix: CONVENTIONAL_TYPE.UNKNOWN,
          description: "create 1 file and update 1 file",
        };

        assert.deepStrictEqual(
          _msgFromChanges(["A    baz.txt", "M    bar.js"]),
          expected
        );
      });

      it("handles 3 files - with different actions", function () {
        const lines = ["A    baz.txt", "M    bar.js", "D    README.md"];

        const expected = {
          prefix: CONVENTIONAL_TYPE.UNKNOWN,
          description: "create 1 file, update 1 file and delete 1 file",
        };

        assert.deepStrictEqual(_msgFromChanges(lines), expected);
      });
    });
  });

  describe("#_formatMsg", function () {
    it("combines a prefix and message correctly", function () {
      assert.strictEqual(
        _formatMsg({
          prefix: CONVENTIONAL_TYPE.FEAT,
          description: "create foo.txt",
        }),
        "feat: create foo.txt"
      );

      assert.strictEqual(
        _formatMsg({
          prefix: CONVENTIONAL_TYPE.BUILD,
          description: "update foo.txt",
        }),
        "build: update foo.txt"
      );

      assert.strictEqual(
        _formatMsg({
          prefix: CONVENTIONAL_TYPE.DOCS,
          description: "update README.md",
        }),
        "docs: update README.md"
      );
    });
  });

  describe("#_newMsg", function () {
    describe("creates a new message from a prefix and message", function () {
      it("handles a single change", function () {
        assert.strictEqual(_newMsg(["A    baz.txt"]), "feat: create baz.txt");
      });

      it("handles multiple changes", function () {
        // Leave the detailed cases to tests for `_msgFromChanges`.

        assert.strictEqual(
          _newMsg(["A    baz.txt", "A    bar.js"]),
          "feat: create baz.txt and bar.js"
        );

        assert.strictEqual(
          _newMsg(["A    baz.txt", "A    bar.js", "A    fizz/fuzz.md"]),
          "feat: create baz.txt, bar.js and fuzz.md"
        );

        assert.strictEqual(
          _newMsg([
            "M    docs/README.md",
            "M    bar/README.md",
            "M    README.md",
          ]),
          "docs: update docs/README.md, bar/README.md and README.md"
        );
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
        // TODO: Make the order of the description pieces should be switched to be more natural.
        //    e.g. 'update .editorconfig - xyz'
        // TODO: If the message is the same, don't add to it.
        // i.e. Don't want to get 'chore: update.editorconfig update .editorconfig'
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
        // In this example, say editing a comment in a config file and entering type as docs and
        // keeping that value instead of a generated one.
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

    it("will use only the new message, if the old message is empty", function () {
      assert.strictEqual(
        _combineOldAndNew(CONVENTIONAL_TYPE.UNKNOWN, "foo bar"),
        "foo bar"
      );

      assert.strictEqual(
        _combineOldAndNew(CONVENTIONAL_TYPE.FEAT, "foo bar"),
        "feat: foo bar"
      );

      assert.strictEqual(
        _combineOldAndNew(CONVENTIONAL_TYPE.FEAT, "foo bar", ""),
        "feat: foo bar"
      );
    });

    describe("combines an existing message with a new message that is set", function () {
      // Using '[ABCD-1234]' as a Jira ticket number. A branch or project name works too.

      describe("when convention cannot be determined from the file changes", function () {
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

        it("combines a plain message and an existing prefix", function () {
          assert.strictEqual(
            _combineOldAndNew(CONVENTIONAL_TYPE.UNKNOWN, "foo bar", "feat:"),
            "feat: foo bar"
          );

          assert.strictEqual(
            _combineOldAndNew(
              CONVENTIONAL_TYPE.UNKNOWN,
              "foo bar",
              "[ABCD-1234] feat:"
            ),
            "[ABCD-1234] feat: foo bar"
          );
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

        describe("recognize the message is identical and does not duplicate it", function () {
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
        it("inserts a new prefix between the old and new messages", function () {
          assert.strictEqual(
            _combineOldAndNew(CONVENTIONAL_TYPE.FEAT, "foo bar", "fizz buzz"),
            "feat: foo bar fizz buzz"
          );

          // Unfortunately if your old message doesn't look like a prefix by having a colon, it just
          // gets treated as an old description and can't be added before the type. Maybe a future
          // enhancement to get '[ABCD-1234] feat: foo bar'.
          assert.strictEqual(
            _combineOldAndNew(CONVENTIONAL_TYPE.FEAT, "foo bar", "[ABCD-1234]"),
            "feat: foo bar [ABCD-1234]"
          );
        });

        it("keeps the old type where there is an new one", function () {
          assert.strictEqual(
            _combineOldAndNew(CONVENTIONAL_TYPE.FEAT, "foo bar", "docs:"),
            "docs: foo bar"
          );

          assert.strictEqual(
            _combineOldAndNew(
              CONVENTIONAL_TYPE.FEAT,
              "foo bar",
              "[ABCD-1234] docs:"
            ),
            "[ABCD-1234] docs: foo bar"
          );
        });

        it("inserts replaces an old prefix with a space with a new one", function () {
          assert.strictEqual(
            _combineOldAndNew(CONVENTIONAL_TYPE.FEAT, "foo bar", "docs: "),
            "docs: foo bar"
          );

          assert.strictEqual(
            _combineOldAndNew(
              CONVENTIONAL_TYPE.FEAT,
              "foo bar",
              "[ABCD-1234] docs: "
            ),
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
