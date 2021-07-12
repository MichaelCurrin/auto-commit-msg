/**
 * Count test module
 */

import * as assert from "assert";
import { count } from "../../generate/count";
import { FileChanges } from "../../git/parseOutput.d";
import { ACTION } from "../../lib/constants";

describe("count", () => {
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

      assert.deepStrictEqual(count(changes), expected);
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

      assert.deepStrictEqual(count(changes), expected);
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

      assert.deepStrictEqual(count(changes), expected);
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

      assert.deepStrictEqual(count(changes), expected);
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

      assert.deepStrictEqual(count(changes), expected);
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

      assert.deepStrictEqual(count(changes), expected);
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

      assert.deepStrictEqual(count(changes), expected);
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

      assert.deepStrictEqual(count(changes), expected);
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

      assert.deepStrictEqual(count(changes), expected);
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

      assert.deepStrictEqual(count(changes), expected);
    });
  })
});
