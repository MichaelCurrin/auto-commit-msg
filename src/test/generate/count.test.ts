/**
 * Count test module
 */
import * as assert from "assert";
import {
  countFilesDesc,
  _countByAction,
  _formatAll,
  _formatOne,
  _moveOrRenameFromChange,
} from "../../generate/count";
import { FileChange } from "../../git/parseOutput.d";

test("Aggregate counts of files as numeric data", function () {
  test("#_countByAction", function () {
    test("should return the correct action and count for one file", function () {
      test("should handle a created file", function () {
        const changes: FileChange[] = [
          {
            x: "A",
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

      test("should handle a created file with spaces", function () {
        const changes: FileChange[] = [
          {
            x: "A",
            y: " ",
            from: "foo bar.txt",
            to: "",
          },
        ];
        const expected = {
          create: { fileCount: 1 },
        };

        assert.deepStrictEqual(_countByAction(changes), expected);
      });

      test("should handle an updated file", function () {
        const changes: FileChange[] = [
          {
            x: "M",
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

      test("should handle a deleted file", function () {
        const changes: FileChange[] = [
          {
            x: "D",
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

      test("should handle a renamed file", function () {
        const changes: FileChange[] = [
          {
            x: "R",
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

      test("should handle a moved file", function () {
        const changes: FileChange[] = [
          {
            x: "R",
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

      test("should handle a renamed and moved file", function () {
        const changes: FileChange[] = [
          {
            x: "R",
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

    test("give correct action and count for files of the same action", function () {
      test("should handle two created files", function () {
        const changes: FileChange[] = [
          {
            x: "A",
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: "A",
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

      test("should handle two renamed files", function () {
        const changes: FileChange[] = [
          {
            x: "R",
            y: " ",
            from: "foo.txt",
            to: "bar.txt",
          },
          {
            x: "R",
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

      test("should handle two created files", function () {
        const changes: FileChange[] = [
          {
            x: "A",
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: "A",
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

      test("should handle three deleted files", function () {
        const changes: FileChange[] = [
          {
            x: "D",
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: "D",
            y: " ",
            from: "bar.txt",
            to: "",
          },
          {
            x: "D",
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

      test("should handle four updated files", function () {
        const changes: FileChange[] = [
          {
            x: "M",
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: "M",
            y: " ",
            from: "bar.txt",
            to: "",
          },
          {
            x: "M",
            y: " ",
            from: "fizz.txt",
            to: "",
          },
          {
            x: "M",
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

    test("give correct actionsand counts for files with different actions", function () {
      test("should handle one created and one updated file", function () {
        const changes: FileChange[] = [
          {
            x: "A",
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: "M",
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

      test("should handle one created and two updated files", function () {
        const changes: FileChange[] = [
          {
            x: "A",
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: "M",
            y: " ",
            from: "bar.txt",
            to: "",
          },
          {
            x: "M",
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

      test("should handle one created, updated, deleted, renamed and two moved files", function () {
        const changes: FileChange[] = [
          {
            x: "A",
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: "M",
            y: " ",
            from: "bar.txt",
            to: "",
          },
          {
            x: "D",
            y: " ",
            from: "fizz.txt",
            to: "",
          },
          {
            x: "R",
            y: " ",
            from: "abc.txt",
            to: "def.txt",
          },
          {
            x: "R",
            y: " ",
            from: "def.txt",
            to: "xyz/def.txt",
          },
          {
            x: "R",
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

test("Identify move, rename, or move and rename", function () {
  test("#_moveOrRenameFromChange", function () {
    test("should return move", function () {
      const change = {
        x: "R",
        y: " ",
        from: "foo.txt",
        to: "bar/foo.txt",
      };
      const expected = "move";

      assert.strictEqual(_moveOrRenameFromChange(change), expected);
    });

    test("should return rename", function () {
      const change = {
        x: "R",
        y: " ",
        from: "foo.txt",
        to: "bar.xt",
      };
      const expected = "rename";

      assert.strictEqual(_moveOrRenameFromChange(change), expected);
    });

    test("should return move and rename", function () {
      const change = {
        x: "R",
        y: " ",
        from: "foo.txt",
        to: "bar/bazz.xt",
      };
      const expected = "move and rename";

      assert.strictEqual(_moveOrRenameFromChange(change), expected);
    });
  });
});

test("Format a single action and count value as text", function () {
  test("#_formatOne", function () {
    test("should handle one file", function () {
      test("should handle one created file", function () {
        assert.strictEqual(_formatOne("create", 1), "create 1 file");
      });

      test("should handle one updated file", function () {
        assert.strictEqual(_formatOne("update", 1), "update 1 file");
      });

      test("should handle one moved file", function () {
        assert.strictEqual(_formatOne("move", 1), "move 1 file");
      });

      test("should handle one renamed file", function () {
        assert.strictEqual(_formatOne("rename", 1), "rename 1 file");
      });
    });

    test("should handle multiple files", function () {
      test("should handle two created files", function () {
        assert.strictEqual(_formatOne("create", 2), "create 2 files");
      });

      test("should handle three deleted files", function () {
        assert.strictEqual(_formatOne("delete", 3), "delete 3 files");
      });
    });
  });
});

test("Convert action and counts to a readable commit message", function () {
  test("#countByActionMsg", function () {
    test("one file", function () {
      test("should handle a created file", function () {
        const actionCounts = {
          create: { fileCount: 1 },
        };
        const expected = "create 1 file";

        assert.strictEqual(_formatAll(actionCounts), expected);
      });

      test("should handle a deleted file", function () {
        const actionCounts = {
          delete: { fileCount: 1 },
        };
        const expected = "delete 1 file";

        assert.strictEqual(_formatAll(actionCounts), expected);
      });
    });

    test("multiples files", function () {
      test("should handle one created file and one updated file", function () {
        const actionCounts = {
          create: { fileCount: 1 },
          update: { fileCount: 1 },
        };
        const expected = "create 1 file and update 1 file";

        assert.strictEqual(_formatAll(actionCounts), expected);
      });

      test("should handle one created, updated and deleted", function () {
        const actionCounts = {
          create: { fileCount: 1 },
          update: { fileCount: 1 },
          delete: { fileCount: 1 },
        };
        const expected = "create 1 file, update 1 file and delete 1 file";

        assert.strictEqual(_formatAll(actionCounts), expected);
      });

      test("should handle one created file and two updated files", function () {
        const actionCounts = {
          create: { fileCount: 1 },
          update: { fileCount: 2 },
        };
        const expected = "create 1 file and update 2 files";

        assert.strictEqual(_formatAll(actionCounts), expected);
      });

      test("should handle two updated file and three deleted files", function () {
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

test("Convert file changes to readable commit message of actions and counts", function () {
  test("#countMsg", function () {
    test("return the action and count for one kind of action", function () {
      test("handles one created file", function () {
        const changes: FileChange[] = [
          {
            x: "A",
            y: " ",
            from: "foo.txt",
            to: "",
          },
        ];

        const expected = "create 1 file";

        assert.strictEqual(countFilesDesc(changes), expected);
      });
    });

    test("handles one updated file", function () {
      const changes: FileChange[] = [
        {
          x: "M",
          y: " ",
          from: "foo.txt",
          to: "",
        },
      ];

      const expected = "update 1 file";

      assert.strictEqual(countFilesDesc(changes), expected);
    });

    test("handles two deleted files", function () {
      const changes: FileChange[] = [
        {
          x: "D",
          y: " ",
          from: "foo.txt",
          to: "",
        },
        {
          x: "D",
          y: " ",
          from: "bar.txt",
          to: "",
        },
      ];
      const expected = "delete 2 files";

      assert.strictEqual(countFilesDesc(changes), expected);
    });
  });

  test("return the action and count for two actions", function () {
    test("handles one created and one updated file", function () {
      const changes: FileChange[] = [
        {
          x: "A",
          y: " ",
          from: "foo.txt",
          to: "",
        },
        {
          x: "M",
          y: " ",
          from: "bar.txt",
          to: "",
        },
      ];

      const expected = "create 1 file and update 1 file";

      assert.strictEqual(countFilesDesc(changes), expected);
    });

    test("handles one created and two updated files", function () {
      const changes: FileChange[] = [
        {
          x: "A",
          y: " ",
          from: "foo.txt",
          to: "",
        },
        {
          x: "M",
          y: " ",
          from: "bar.txt",
          to: "",
        },
        {
          x: "M",
          y: " ",
          from: "bazz.txt",
          to: "",
        },
      ];

      const expected = "create 1 file and update 2 files";

      assert.strictEqual(countFilesDesc(changes), expected);
    });

    test("handles two updated files and one created file", function () {
      // Same data as previous case, but with the order array changed.
      const changes: FileChange[] = [
        {
          x: "M",
          y: " ",
          from: "bar.txt",
          to: "",
        },
        {
          x: "M",
          y: " ",
          from: "bazz.txt",
          to: "",
        },
        {
          x: "A",
          y: " ",
          from: "foo.txt",
          to: "",
        },
      ];

      const expected = "update 2 files and create 1 file";

      assert.strictEqual(countFilesDesc(changes), expected);
    });

    test("return the action and count for more than two actions", function () {
      test("handles one created, one updated and one deleted file", function () {
        const changes: FileChange[] = [
          {
            x: "A",
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: "M",
            y: " ",
            from: "bar.txt",
            to: "",
          },
          {
            x: "D",
            y: " ",
            from: "bazz.txt",
            to: "",
          },
        ];

        const expected = "create 1 file, update 1 file and delete 1 file";

        assert.strictEqual(countFilesDesc(changes), expected);
      });

      test("handles two created, one updated and one deleted file", function () {
        const changes: FileChange[] = [
          {
            x: "A",
            y: " ",
            from: "fizz.txt",
            to: "",
          },
          {
            x: "A",
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: "M",
            y: " ",
            from: "bar.txt",
            to: "",
          },
          {
            x: "D",
            y: " ",
            from: "bazz.txt",
            to: "",
          },
        ];

        const expected = "create 2 files, update 1 file and delete 1 file";

        assert.strictEqual(countFilesDesc(changes), expected);
      });

      test("handles one created, two updated and one deleted file", function () {
        const changes: FileChange[] = [
          {
            x: "A",
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: "M",
            y: " ",
            from: "bar.txt",
            to: "",
          },
          {
            x: "M",
            y: " ",
            from: "fizz.txt",
            to: "",
          },
          {
            x: "D",
            y: " ",
            from: "bazz.txt",
            to: "",
          },
        ];

        const expected = "create 1 file, update 2 files and delete 1 file";

        assert.strictEqual(countFilesDesc(changes), expected);
      });

      test("handles one created, one updated and one deleted file", function () {
        const changes: FileChange[] = [
          {
            x: "A",
            y: " ",
            from: "foo.txt",
            to: "",
          },
          {
            x: "M",
            y: " ",
            from: "bar.txt",
            to: "",
          },
          {
            x: "D",
            y: " ",
            from: "bazz.txt",
            to: "",
          },
          {
            x: "D",
            y: " ",
            from: "fizz.txt",
            to: "",
          },
        ];

        const expected = "create 1 file, update 1 file and delete 2 files";

        assert.strictEqual(countFilesDesc(changes), expected);
      });
    });
  });
});
