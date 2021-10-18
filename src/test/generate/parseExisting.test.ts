import * as assert from "assert";
import {
  splitMsg,
  _splitPrefixDesc,
  _splitPrefixes,
} from "../../generate/parseExisting";

describe("Split an existing message into components", function () {
  describe("#_splitPrefixDesc", function () {
    it("handles a description alone", function () {
      assert.deepStrictEqual(_splitPrefixDesc("abc def"), {
        prefix: "",
        description: "abc def",
      });
    });
  });

  describe("#_splitPrefixes", function () {
    it("returns empty values for an empty string", function () {
      assert.deepStrictEqual(_splitPrefixes(""), {
        customPrefix: "",
        typePrefix: "",
      });
    });

    it("returns a single word as the type prefix", function () {
      assert.deepStrictEqual(_splitPrefixes("foo"), {
        customPrefix: "",
        typePrefix: "foo",
      });
    });

    it("splits two words correctly as custom and type", function () {
      assert.deepStrictEqual(_splitPrefixes("foo bar"), {
        customPrefix: "foo",
        typePrefix: "bar",
      });
    });

    it("splits three words correctly as two for custom and one for type", function () {
      assert.deepStrictEqual(_splitPrefixes("foo bar bazz"), {
        customPrefix: "foo bar",
        typePrefix: "bazz",
      });
    });

    it("splits four words correctly as three for custom and one for type", function () {
      assert.deepStrictEqual(_splitPrefixes("foo bar bazz buzz"), {
        customPrefix: "foo bar bazz",
        typePrefix: "buzz",
      });
    });
  });

  describe("#splitMsg", function () {
    it("handles a description alone", function () {
      assert.deepStrictEqual(splitMsg("abc def"), {
        customPrefix: "",
        typePrefix: "",
        description: "abc def",
      });

      // Our logic can't turn the Jira number into a custom prefix if there is
      // no type prefix in the old message, so it just goes into the
      // description.
      // TODO: Handle hard bracket recognition or some other pattern here, as
      // then no logic is needed for commit message template (which VS Code can
      // already read).
      assert.deepStrictEqual(splitMsg("[ABCD-1234]"), {
        customPrefix: "",
        typePrefix: "",
        description: "[ABCD-1234]",
      });
      assert.deepStrictEqual(splitMsg("[ABCD-1234] abc def"), {
        customPrefix: "",
        typePrefix: "",
        description: "[ABCD-1234] abc def",
      });
    });

    it("handles a type prefix alone", function () {
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
