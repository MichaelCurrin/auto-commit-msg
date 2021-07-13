/**
 * Count test module
 */
import * as assert from "assert";
import {
  countMsg,
  _countByAction,
  _formatAll,
  _formatOne,
  _moveOrRenameFromChange
} from "../../generate/count";
import { FileChanges } from "../../git/parseOutput.d";
import { ACTION } from "../../lib/constants";

describe("Aggregate counts of files as numeric data", function () {
  describe("#_countByAction", function () {
    describe("should return the correct action and count for one file", function () {
      it("should handle a created file", function () {
        const changes: FileChanges[] = [
          {
            x: ACTION.A,
            y: " ",
            from: "foo.txt",
            to: "",
          },
        ];
        const expected = {
          create: { fileCount: 1 },
        };

        assert.deepStrictEqual(_countByAction(changes), expected);
      });

      it("should handle an updated file", function () {
        const changes: FileChanges[] = [
          {
            x: ACTION.M,
            y: " ",
            from: "foo.txt",
            to: "",
          },
        ];
        const expected = {
          update: { fileCount: 1 },
        };

        assert.deepStrictEqual(_countByAction(changes), expected);
      });

      it("should handle a deleted file", function () {
        const changes: FileChanges[] = [
          {
            x: ACTION.D,
            y: " ",
            from: "foo.txt",
            to: "",
          },
        ];
        const expected = {
          delete: { fileCount: 1 },
        };

        assert.deepStrictEqual(_countByAction(changes), expected);
      });

      it("should handle a renamed file", function () {
        const changes: FileChanges[] = [
          {
            x: ACTION.R,
            y: " ",
            from: "foo.txt",
            to: "bar.txt",
          },
        ];
        const expected = {
          rename: { fileCount: 1 },
        };

        assert.deepStrictEqual(_countByAction(changes), expected);
      });

      it("should handle a moved file", function () {
        const changes: FileChanges[] = [
          {
            x: ACTION.R,
            y: " ",
            from: "foo.txt",
            to: "bar/foo.txt",
          },
        ];
        const expected = {
          move: { fileCount: 1 },
        };

        assert.deepStrictEqual(_countByAction(changes), expected);
      });

      it("should handle a renamed and moved file", function () {
        const changes: FileChanges[] = [
          {
            x: ACTION.R,
            y: " ",
            from: "foo.txt",
            to: "bar/buzz.txt",
          },
        ];
        const expected = {
          "move and rename": { fileCount: 1 },
        };

        assert.deepStrictEqual(_countByAction(changes), expected);
      });
    });

    describe("give correct action and count for files of the same action", function () {
      it("should handle two created files", function () {
        const changes: FileChanges[] = [
          {
            x: ACTION.A,
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: ACTION.A,
            y: " ",
            from: "bar.txt",
            to: "",
          },
        ];
        const expected = {
          create: { fileCount: 2 },
        };

        assert.deepStrictEqual(_countByAction(changes), expected);
      });

      it("should handle two renamed files", function () {
        const changes: FileChanges[] = [
          {
            x: ACTION.R,
            y: " ",
            from: "foo.txt",
            to: "bar.txt",
          },
          {
            x: ACTION.R,
            y: " ",
            from: "bazz.txt",
            to: "buzz.txt",
          },
        ];
        const expected = {
          rename: { fileCount: 2 },
        };

        assert.deepStrictEqual(_countByAction(changes), expected);
      });

      it("should handle two created files", function () {
        const changes: FileChanges[] = [
          {
            x: ACTION.A,
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: ACTION.A,
            y: " ",
            from: "bar.txt",
            to: "",
          },
        ];
        const expected = {
          create: { fileCount: 2 },
        };

        assert.deepStrictEqual(_countByAction(changes), expected);
      });

      it("should handle three deleted files", function () {
        const changes: FileChanges[] = [
          {
            x: ACTION.D,
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: ACTION.D,
            y: " ",
            from: "bar.txt",
            to: "",
          },
          {
            x: ACTION.D,
            y: " ",
            from: "bazz.txt",
            to: "",
          },
        ];
        const expected = {
          delete: { fileCount: 3 },
        };

        assert.deepStrictEqual(_countByAction(changes), expected);
      });

      it("should handle four updated files", function () {
        const changes: FileChanges[] = [
          {
            x: ACTION.M,
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: ACTION.M,
            y: " ",
            from: "bar.txt",
            to: "",
          },
          {
            x: ACTION.M,
            y: " ",
            from: "fizz.txt",
            to: "",
          },
          {
            x: ACTION.M,
            y: " ",
            from: "buzz.txt",
            to: "",
          },
        ];
        const expected = {
          update: { fileCount: 4 },
        };

        assert.deepStrictEqual(_countByAction(changes), expected);
      });
    });

    describe("give correct actionsand counts for files with different actions", function () {
      it("should handle one created and one updated file", function () {
        const changes: FileChanges[] = [
          {
            x: ACTION.A,
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: ACTION.M,
            y: " ",
            from: "bar.txt",
            to: "",
          },
        ];
        const expected = {
          create: { fileCount: 1 },
          update: { fileCount: 1 },
        };

        assert.deepStrictEqual(_countByAction(changes), expected);
      });

      it("should handle one created and two updated files", function () {
        const changes: FileChanges[] = [
          {
            x: ACTION.A,
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: ACTION.M,
            y: " ",
            from: "bar.txt",
            to: "",
          },
          {
            x: ACTION.M,
            y: " ",
            from: "fizz.txt",
            to: "",
          },
        ];
        const expected = {
          create: { fileCount: 1 },
          update: { fileCount: 2 },
        };

        assert.deepStrictEqual(_countByAction(changes), expected);
      });

      it("should handle one created, updated, deleted, renamed and two moved files", function () {
        const changes: FileChanges[] = [
          {
            x: ACTION.A,
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: ACTION.M,
            y: " ",
            from: "bar.txt",
            to: "",
          },
          {
            x: ACTION.D,
            y: " ",
            from: "fizz.txt",
            to: "",
          },
          {
            x: ACTION.R,
            y: " ",
            from: "abc.txt",
            to: "def.txt",
          },
          {
            x: ACTION.R,
            y: " ",
            from: "def.txt",
            to: "xyz/def.txt",
          },
          {
            x: ACTION.R,
            y: " ",
            from: "src/main.js",
            to: "main.js",
          },
        ];
        const expected = {
          create: { fileCount: 1 },
          update: { fileCount: 1 },
          delete: { fileCount: 1 },
          rename: { fileCount: 1 },
          move: { fileCount: 2 },
        };

        assert.deepStrictEqual(_countByAction(changes), expected);
      });
    });
  });
});

describe("Identify move, rename, or move and rename", function () {
  describe("#_moveOrRenameFromChange", function () {
    it("should return move", function () {
      const change = {
        x: ACTION.R,
        y: " ",
        from: "foo.txt",
        to: "bar/foo.txt",
      };
      const expected = "move";

      assert.strictEqual(_moveOrRenameFromChange(change), expected);
    });

    it("should return rename", function () {
      const change = {
        x: ACTION.R,
        y: " ",
        from: "foo.txt",
        to: "bar.xt",
      };
      const expected = "rename";

      assert.strictEqual(_moveOrRenameFromChange(change), expected);
    });

    it("should return move and rename", function () {
      const change = {
        x: ACTION.R,
        y: " ",
        from: "foo.txt",
        to: "bar/bazz.xt",
      };
      const expected = "move and rename";

      assert.strictEqual(_moveOrRenameFromChange(change), expected);
    });
  });
});

describe("Format a single action and count value as text", function () {
  describe("#_formatOne", function () {
    describe("should handle one file", function () {
      it("should handle one created file", function () {
        assert.strictEqual(_formatOne("create", 1), "create 1 file");
      });

      it("should handle one updated file", function () {
        assert.strictEqual(_formatOne("update", 1), "update 1 file");
      });

      it("should handle one moved file", function () {
        assert.strictEqual(_formatOne("move", 1), "move 1 file");
      });

      it("should handle one renamed file", function () {
        assert.strictEqual(_formatOne("rename", 1), "rename 1 file");
      });
    });

    describe("should handle multiple files", function () {
      it("should handle two created files", function () {
        assert.strictEqual(_formatOne("create", 2), "create 2 files");
      });

      it("should handle three deleted files", function () {
        assert.strictEqual(_formatOne("delete", 3), "delete 3 files");
      });
    });
  });
});

describe("Convert action and counts to a readable commit message", function () {
  describe("#countByActionMsg", function () {
    describe("one file", function () {
      it("should handle a created file", function () {
        const actionCounts = {
          create: { fileCount: 1 },
        };
        const expected = "create 1 file";

        assert.strictEqual(_formatAll(actionCounts), expected);
      });

      it("should handle a deleted file", function () {
        const actionCounts = {
          delete: { fileCount: 1 },
        };
        const expected = "delete 1 file";

        assert.strictEqual(_formatAll(actionCounts), expected);
      });
    });

    describe("multiples files", function () {
      it("should handle one created file and one updated file", function () {
        const actionCounts = {
          create: { fileCount: 1 },
          update: { fileCount: 1 },
        };
        const expected = "create 1 file and update 1 file";

        assert.strictEqual(_formatAll(actionCounts), expected);
      });

      it("should handle one created, updated and deleted", function () {
        const actionCounts = {
          create: { fileCount: 1 },
          update: { fileCount: 1 },
          delete: { fileCount: 1 },
        };
        const expected = "create 1 file, update 1 file and delete 1 file";

        assert.strictEqual(_formatAll(actionCounts), expected);
      });

      it("should handle one created file and two updated files", function () {
        const actionCounts = {
          create: { fileCount: 1 },
          update: { fileCount: 2 },
        };
        const expected = "create 1 file and update 2 files";

        assert.strictEqual(_formatAll(actionCounts), expected);
      });

      it("should handle two updated file and three deleted files", function () {
        const actionCounts = {
          update: { fileCount: 2 },
          delete: { fileCount: 3 },
        };
        const expected = "update 2 files and delete 3 files";

        assert.strictEqual(_formatAll(actionCounts), expected);
      });
    });
  });
});

describe("Convert file changes to readable commit message of actions and counts", function () {
  describe("#countMsg", function () {
    describe("return the action and count for one kind of action", function () {
      it("handles one created file", function () {
        const changes: FileChanges[] = [
          {
            x: ACTION.A,
            y: " ",
            from: "foo.txt",
            to: "",
          },
        ];

        const expected = "create 1 file";

        assert.strictEqual(countMsg(changes), expected);
      });
    });

    it("handles one updated file", function () {
      const changes: FileChanges[] = [
        {
          x: ACTION.M,
          y: " ",
          from: "foo.txt",
          to: "",
        },
      ];

      const expected = "update 1 file";

      assert.strictEqual(countMsg(changes), expected);
    });

    it("handles two deleted files", function () {
      const changes: FileChanges[] = [
        {
          x: ACTION.D,
          y: " ",
          from: "foo.txt",
          to: "",
        },
        {
          x: ACTION.D,
          y: " ",
          from: "bar.txt",
          to: "",
        },
      ];
      const expected = "delete 2 files";

      assert.strictEqual(countMsg(changes), expected);
    });
  });

  describe("return the action and count for multiple actions", function () {
    it("handles one created and one updated file", function () {
      const changes: FileChanges[] = [
        {
          x: ACTION.A,
          y: " ",
          from: "foo.txt",
          to: "",
        },
        {
          x: ACTION.M,
          y: " ",
          from: "foo.txt",
          to: "",
        },
      ];

      const expected = "create 1 file and update 1 file";

      assert.strictEqual(countMsg(changes), expected);
    });
  });
});
