import * as assert from "assert";
import {
  splitMsg,
  _splitPrefixes,
  _splitPrefixesAndDesc,
} from "../../generate/parseExisting";

test("Split an existing message into components", function () {
  test("#_splitPrefixesAndDesc", function () {
    test("handles a description alone", function () {
      const value = "foo the bar";
      const expected = {
        prefixes: "",
        description: "foo the bar",
      };
      assert.deepStrictEqual(_splitPrefixesAndDesc(value), expected);
    });

    test("splits correctly with prefix and description set", function () {
      test("handles a type prefix", function () {
        const value = "feat: foo the bar";
        const expected = {
          prefixes: "feat",
          description: "foo the bar",
        };
        assert.deepStrictEqual(_splitPrefixesAndDesc(value), expected);
      });

      test("handles a custom prefix", function () {
        const value = "[ABC-123]: foo the bar";
        const expected = {
          prefixes: "[ABC-123]",
          description: "foo the bar",
        };
        assert.deepStrictEqual(_splitPrefixesAndDesc(value), expected);
      });

      test("handles a custom prefix and type prefix", function () {
        const value = "[ABC-123] feat: foo the bar";
        const expected = {
          prefixes: "[ABC-123] feat",
          description: "foo the bar",
        };
        assert.deepStrictEqual(_splitPrefixesAndDesc(value), expected);
      });
    });
  });

  test("#_splitPrefixes", function () {
    test("returns empty values for an empty string", function () {
      assert.deepStrictEqual(_splitPrefixes(""), {
        customPrefix: "",
        typePrefix: "",
      });
    });

    test("returns a single word as the type prefix", function () {
      assert.deepStrictEqual(_splitPrefixes("foo"), {
        customPrefix: "",
        typePrefix: "foo",
      });
    });

    test("splits two words correctly as custom and type", function () {
      assert.deepStrictEqual(_splitPrefixes("foo bar"), {
        customPrefix: "foo",
        typePrefix: "bar",
      });
    });

    test("splits three words correctly as two for custom and one for type", function () {
      assert.deepStrictEqual(_splitPrefixes("foo bar bazz"), {
        customPrefix: "foo bar",
        typePrefix: "bazz",
      });
    });

    test("splits four words correctly as three for custom and one for type", function () {
      assert.deepStrictEqual(_splitPrefixes("foo bar bazz buzz"), {
        customPrefix: "foo bar bazz",
        typePrefix: "buzz",
      });
    });
  });

  test("#splitMsg", function () {
    test("handles a description alone", function () {
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
      // already read). Or maybe just single word is enough.
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

    test("handles a type prefix alone", function () {
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

    test("separates a prefix and description", function () {
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

    test("separates a custom prefix, conventional type, and description", function () {
      test("handles a Jira number with hard brackets", function () {
        assert.deepStrictEqual(splitMsg("[ABCD-1234] docs: abc def"), {
          customPrefix: "[ABCD-1234]",
          typePrefix: "docs",
          description: "abc def",
        });
      });

      test("handles a Jira number with no hard brackets", function () {
        assert.deepStrictEqual(splitMsg("ABCD-1234 docs: abc def"), {
          customPrefix: "ABCD-1234",
          typePrefix: "docs",
          description: "abc def",
        });
      });

      // TODO:
      // test("handles a two words before the type", function () {
      //   assert.deepStrictEqual(splitMsg("ABCD 1234 docs: abc def"), {
      //     customPrefix: "ABCD 1234",
      //     typePrefix: "docs",
      //     description: "abc def",
      //   });
      // });
    });
  });
});
