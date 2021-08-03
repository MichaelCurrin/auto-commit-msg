import * as assert from "assert";
import { splitMsg } from "../../generate/parseExisting";

describe("Split a message into components", function () {
  describe("#splitMsg", function () {
    it("handles a description alone", function () {
      assert.deepStrictEqual(splitMsg("abc def"), {
        customPrefix: "",
        typePrefix: "",
        description: "abc def",
      });
      assert.deepStrictEqual(splitMsg("[ABCD-1234]"), {
        customPrefix: "",
        typePrefix: "",
        description: "[ABCD-1234]",
      });
    });

    it("handles a prefix alone", function () {
      assert.deepStrictEqual(splitMsg("docs:"), {
        customPrefix: "",
        typePrefix: "docs",
        description: "",
      });
      assert.deepStrictEqual(splitMsg("feat:"), {
        customPrefix: "",
        typePrefix: "feat",
        description: "",
      });

      assert.deepStrictEqual(splitMsg("docs: "), {
        customPrefix: "",
        typePrefix: "docs",
        description: "",
      });
    });

    it("separates a prefix and description", function () {
      assert.deepStrictEqual(splitMsg("docs: abc"), {
        customPrefix: "",
        typePrefix: "docs",
        description: "abc",
      });
      assert.deepStrictEqual(splitMsg("docs: abc def"), {
        customPrefix: "",
        typePrefix: "docs",
        description: "abc def",
      });
      assert.deepStrictEqual(splitMsg("feat: abc def"), {
        customPrefix: "",
        typePrefix: "feat",
        description: "abc def",
      });
    });

    describe("separates a custom prefix, conventional type, and description", function () {
      it("handles a Jira number with hard brackets", function () {
        assert.deepStrictEqual(splitMsg("[ABCD-1234] docs: abc def"), {
          customPrefix: "[ABCD-1234]",
          typePrefix: "docs",
          description: "abc def",
        });
      });

      it("handles a Jira number with no hard brackets", function () {
        assert.deepStrictEqual(splitMsg("ABCD-1234 docs: abc def"), {
          customPrefix: "ABCD-1234",
          typePrefix: "docs",
          description: "abc def",
        });
      });

      // TODO:
      // it("handles a two words before the type", function () {
      //   assert.deepStrictEqual(splitMsg("ABCD 1234 docs: abc def"), {
      //     customPrefix: "ABCD 1234",
      //     typePrefix: "docs",
      //     description: "abc def",
      //   });
      // });
    });
  });
});
