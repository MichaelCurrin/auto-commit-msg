/**
 * Conventional commit test module.
 *
 * Test the categorization of changed files as conventional commit types.
 */
import * as assert from "assert";
import {
  ConventionalCommit,
  getConventionType,
} from "../../generate/convCommit";
import { ACTION, CONVENTIONAL_TYPE } from "../../lib/constants";

test("Test #ConventionalCommit class for path-based conventional commit logic", function () {
  test("#isDocsRelated", function () {
    test("determines that a README file is a doc", function () {
      assert.strictEqual(
        new ConventionalCommit("README.md").isDocsRelated(),
        true
      );
      assert.strictEqual(
        new ConventionalCommit("README.rst").isDocsRelated(),
        true
      );
      assert.strictEqual(
        new ConventionalCommit("Readme.txt").isDocsRelated(),
        true
      );
      assert.strictEqual(
        new ConventionalCommit("readme").isDocsRelated(),
        true
      );

      assert.strictEqual(
        new ConventionalCommit("FEEDME.md").isDocsRelated(),
        false
      );
    });

    test("determines that a CONTRIBUTING file is a doc", function () {
      assert.strictEqual(
        new ConventionalCommit("CONTRIBUTING.md").isDocsRelated(),
        true
      );
      assert.strictEqual(
        new ConventionalCommit("contributing.md").isDocsRelated(),
        true
      );
    });

    test("determines that a `.rst` file is a doc", function () {
      assert.strictEqual(
        new ConventionalCommit("README.rst").isDocsRelated(),
        true
      );
      assert.strictEqual(
        new ConventionalCommit("foo.rst").isDocsRelated(),
        true
      );
    });

    test("determines a file in the docs directory is a doc", function () {
      assert.strictEqual(
        new ConventionalCommit("docs/fizz.md").isDocsRelated(),
        true
      );
      assert.strictEqual(
        new ConventionalCommit("docs/foo.img").isDocsRelated(),
        true
      );

      assert.strictEqual(
        new ConventionalCommit("docs/fizz/foo.img").isDocsRelated(),
        true
      );

      assert.strictEqual(
        new ConventionalCommit("fuzz/fizz.md").isDocsRelated(),
        false
      );
    });
  });

  test("#isBuildRelated", function () {
    test("can recognize a build change for a build-related filename", function () {
      assert.strictEqual(
        new ConventionalCommit("Dockerfile").isBuildRelated(),
        true
      );
      assert.strictEqual(
        new ConventionalCommit("foo/Dockerfile").isBuildRelated(),
        true
      );

      assert.strictEqual(
        new ConventionalCommit("foo.txt").isBuildRelated(),
        false
      );
      assert.strictEqual(
        new ConventionalCommit("fizz/foo.txt").isBuildRelated(),
        false
      );
    });
  });

  test("#isCIRelated", function () {
    test("can tell a CI change is in a CircleCI directory", function () {
      assert.strictEqual(
        new ConventionalCommit(".circleci/foo.txt").isCIRelated(),
        true
      );

      assert.strictEqual(
        new ConventionalCommit("foo.txt").isCIRelated(),
        false
      );
      assert.strictEqual(
        new ConventionalCommit("fizz/foo.txt").isCIRelated(),
        false
      );
    });

    test("can tell a CI change is in a workflows directory", function () {
      assert.strictEqual(
        new ConventionalCommit(".github/workflows/foo.txt").isCIRelated(),
        true
      );

      assert.strictEqual(
        new ConventionalCommit("foo.txt").isCIRelated(),
        false
      );
      assert.strictEqual(
        new ConventionalCommit(".github/foo.txt").isCIRelated(),
        false
      );
    });

    test("can tell a CI change for a CI filename", function () {
      assert.strictEqual(
        new ConventionalCommit("netlify.toml").isCIRelated(),
        true
      );
      assert.strictEqual(
        new ConventionalCommit("foo/netlify.toml").isCIRelated(),
        true
      );

      assert.strictEqual(
        new ConventionalCommit("foo.txt").isCIRelated(),
        false
      );
    });
  });

  test("#isTestRelated", function () {
    test("can tell a test directory is for tests", function () {
      assert.strictEqual(
        new ConventionalCommit("test/foo.js").isTestRelated(),
        true
      );
      assert.strictEqual(
        new ConventionalCommit("tests/foo.js").isTestRelated(),
        true
      );
      assert.strictEqual(
        new ConventionalCommit("spec/foo.js").isTestRelated(),
        true
      );

      assert.strictEqual(
        new ConventionalCommit("unit_tests/foo.js").isTestRelated(),
        true
      );
    });

    test("can tell a test file is for tests", function () {
      assert.strictEqual(
        new ConventionalCommit("foo/bar.test.js").isTestRelated(),
        true
      );
      assert.strictEqual(
        new ConventionalCommit("foo/test_bar.js").isTestRelated(),
        true
      );
    });
  });

  test("#getType", function () {
    // Rather than true and false like in above tests this actually categorizes
    // and also it closer to the real world as it through a hierarchy (for
    // example .yml is config-related unless it is for a CI file). But, this
    // doesn't care what the action is like create or delete or modify, so it
    // won't impose meaning based on that.
    test("sees a build file as build", function () {
      assert.strictEqual(
        new ConventionalCommit("Makefile").getType(),
        CONVENTIONAL_TYPE.BUILD
      );
      assert.strictEqual(
        new ConventionalCommit("Dockerfile").getType(),
        CONVENTIONAL_TYPE.BUILD
      );

      assert.strictEqual(
        new ConventionalCommit("foo.gemspec").getType(),
        CONVENTIONAL_TYPE.BUILD
      );

      assert.strictEqual(
        new ConventionalCommit("package.json").getType(),
        CONVENTIONAL_TYPE.BUILD
      );
    });

    test("sees a dependency-related file as 'build' and with dependency scope", function () {
      assert.strictEqual(
        new ConventionalCommit("Gemfile").getType(),
        CONVENTIONAL_TYPE.BUILD_DEPENDENCIES
      );

      assert.strictEqual(
        new ConventionalCommit("package-lock.json").getType(),
        CONVENTIONAL_TYPE.BUILD_DEPENDENCIES
      );

      assert.strictEqual(
        new ConventionalCommit("requirements.txt").getType(),
        CONVENTIONAL_TYPE.BUILD_DEPENDENCIES
      );
      assert.strictEqual(
        new ConventionalCommit("requirements-dev.txt").getType(),
        CONVENTIONAL_TYPE.BUILD_DEPENDENCIES
      );
    });

    // TODO: Break into categories
    test("can tell a type for other types", function () {
      assert.strictEqual(
        new ConventionalCommit("foo").getType(),
        CONVENTIONAL_TYPE.UNKNOWN
      );

      assert.strictEqual(
        new ConventionalCommit("test/foo.js").getType(),
        CONVENTIONAL_TYPE.TEST
      );

      assert.strictEqual(
        new ConventionalCommit(".github/workflows/foo.yml").getType(),
        CONVENTIONAL_TYPE.CI
      );

      assert.strictEqual(
        new ConventionalCommit("README.md").getType(),
        CONVENTIONAL_TYPE.DOCS
      );

      assert.strictEqual(
        new ConventionalCommit("LICENSE").getType(),
        CONVENTIONAL_TYPE.CHORE
      );
    });
  });
});

test("#getConventionType", function () {
  test("uses feat for a new file if no other match is found", function () {
    const add = ACTION.A;

    assert.strictEqual(
      getConventionType(add, "README.md"),
      CONVENTIONAL_TYPE.DOCS
    );
    assert.strictEqual(
      getConventionType(add, "tests/foo.js"),
      CONVENTIONAL_TYPE.TEST
    );

    assert.strictEqual(
      getConventionType(add, "foo.txt"),
      CONVENTIONAL_TYPE.FEAT
    );
  });
  test("knows a deleted file is always a chore", function () {
    const del = ACTION.D;

    assert.strictEqual(
      getConventionType(del, "foo.txt"),
      CONVENTIONAL_TYPE.CHORE
    );
    assert.strictEqual(
      getConventionType(del, "README.md"),
      CONVENTIONAL_TYPE.CHORE
    );

    assert.strictEqual(
      getConventionType(del, "tests/foo.js"),
      CONVENTIONAL_TYPE.CHORE
    );
  });

  test("knows a renamed or moved file is always chore", function () {
    const renameOrMove = ACTION.R;

    assert.strictEqual(
      getConventionType(renameOrMove, "foo.txt"),
      CONVENTIONAL_TYPE.CHORE
    );
    assert.strictEqual(
      getConventionType(renameOrMove, "fuzz/foo.txt"),
      CONVENTIONAL_TYPE.CHORE
    );

    assert.strictEqual(
      getConventionType(renameOrMove, "README.md"),
      CONVENTIONAL_TYPE.CHORE
    );
    assert.strictEqual(
      getConventionType(renameOrMove, "docs/foo.txt"),
      CONVENTIONAL_TYPE.CHORE
    );

    assert.strictEqual(
      getConventionType(renameOrMove, "tests/foo.js"),
      CONVENTIONAL_TYPE.CHORE
    );
  });

  test("uses conventional commit type from path for a modified file, or leaves unset", function () {
    const modified = ACTION.M;

    assert.strictEqual(
      getConventionType(modified, "foo.txt"),
      CONVENTIONAL_TYPE.UNKNOWN
    );
    assert.strictEqual(
      getConventionType(modified, "fizz/foo.txt"),
      CONVENTIONAL_TYPE.UNKNOWN
    );

    assert.strictEqual(
      getConventionType(modified, "README.md"),
      CONVENTIONAL_TYPE.DOCS
    );
    assert.strictEqual(
      getConventionType(modified, "tests/foo.js"),
      CONVENTIONAL_TYPE.TEST
    );
  });
});
