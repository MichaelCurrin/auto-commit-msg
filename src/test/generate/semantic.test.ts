import * as assert from 'assert';
import { ACTION, CONVENTIONAL_TYPE } from '../../generate/constants';
import { getSemanticConvention, Semantic } from '../../generate/semantic';

describe('Test #Semantic class for path-based conventional commit logic', function () {
  describe('#isDocRelated()', function () {
    it('determines README.md is a doc', function () {
      assert.strictEqual(new Semantic('README.md').isDocRelated(), true);
      assert.strictEqual(new Semantic('FEEDME.md').isDocRelated(), false);
    });

    it('determines a file in the docs directory is a doc', function () {
      assert.strictEqual(new Semantic('docs/fizz.md').isDocRelated(), true);
      assert.strictEqual(new Semantic('docs/foo.img').isDocRelated(), true);

      assert.strictEqual(new Semantic('docs/fizz/foo.img').isDocRelated(), true);

      assert.strictEqual(new Semantic('fuzz/fizz.md').isDocRelated(), false);
    });
  });

  describe('#isBuildRelated()', function () {
    it('can tell a build change of a build filename', function () {
      assert.strictEqual(new Semantic('Dockerfile').isBuildRelated(), true);
      assert.strictEqual(new Semantic('foo/Dockerfile').isBuildRelated(), true);

      assert.strictEqual(new Semantic('setup.py').isBuildRelated(), true);

      assert.strictEqual(new Semantic('foo.txt').isBuildRelated(), false);
      assert.strictEqual(new Semantic('fizz/foo.txt').isBuildRelated(), false);
    });
  });

  describe('#isCIRelated()', function () {
    it('can tell a CI change is in a CircleCI directory', function () {
      assert.strictEqual(new Semantic('.circleci/foo.txt').isCIRelated(), true);

      assert.strictEqual(new Semantic('foo.txt').isCIRelated(), false);
      assert.strictEqual(new Semantic('fizz/foo.txt').isCIRelated(), false);
    });

    it('can tell a CI change is in a workflows directory', function () {
      assert.strictEqual(new Semantic('.github/workflows/foo.txt').isCIRelated(), true);

      assert.strictEqual(new Semantic('foo.txt').isCIRelated(), false);
      assert.strictEqual(new Semantic('.github/foo.txt').isCIRelated(), false);
    });

    it('can tell a CI change for a CI filename', function () {
      assert.strictEqual(new Semantic('netlify.toml').isCIRelated(), true);
      assert.strictEqual(new Semantic('foo/netlify.toml').isCIRelated(), true);

      assert.strictEqual(new Semantic('foo.txt').isCIRelated(), false);
    });
  });

  describe('#isTestRelated()', function () {
    it('can tell a test directory is for tests', function () {
      assert.strictEqual(new Semantic('test/foo.js').isTestRelated(), true);
      assert.strictEqual(new Semantic('tests/foo.js').isTestRelated(), true);
      assert.strictEqual(new Semantic('spec/foo.js').isTestRelated(), true);

      assert.strictEqual(new Semantic('unit_tests/foo.js').isTestRelated(), true);
    });

    it('can tell a test file is for tests', function () {
      assert.strictEqual(new Semantic('foo/bar.test.js').isTestRelated(), true);
      assert.strictEqual(new Semantic('foo/test_bar.js').isTestRelated(), true);
    });
  });

  describe('#getType()', function () {
    // Rather than true and false like in above tests this actually categorizes and also it closer
    // to the real world as it through a hierarchy (for example .yml is config-related unless it is
    // for a CI file). But, this doesn't care what the action is like create or delete or modify, so
    // it won't impose meaning based on that.
    it('can tell a type for a build file', function () {
      assert.strictEqual(new Semantic('Makefile').getType(), CONVENTIONAL_TYPE.BUILD);
      assert.strictEqual(new Semantic('Gemfile').getType(), CONVENTIONAL_TYPE.BUILD);

      assert.strictEqual(new Semantic('package.json').getType(), CONVENTIONAL_TYPE.BUILD);
      assert.strictEqual(new Semantic('package-lock.json').getType(), CONVENTIONAL_TYPE.BUILD);

      assert.strictEqual(new Semantic('requirements.txt').getType(), CONVENTIONAL_TYPE.BUILD);
      assert.strictEqual(new Semantic('requirements-dev.txt').getType(), CONVENTIONAL_TYPE.BUILD);
    });

    // TODO Break into categories
    it('can tell a type for other types', function () {
      assert.strictEqual(new Semantic('foo').getType(), CONVENTIONAL_TYPE.UNKNOWN);

      assert.strictEqual(new Semantic('test/foo.js').getType(), CONVENTIONAL_TYPE.TEST);

      assert.strictEqual(new Semantic('.github/workflows/foo.yml').getType(), CONVENTIONAL_TYPE.CI);

      assert.strictEqual(new Semantic('README.md').getType(), CONVENTIONAL_TYPE.DOCS);

      assert.strictEqual(new Semantic('LICENSE').getType(), CONVENTIONAL_TYPE.CHORE);
    });
  });
});

describe('#getSemanticConvention()', function () {
  it('knows for a new file that category is feat (and probably not a fix), unless there is a match for it under another category', function () {
    const add = ACTION.A;

    assert.strictEqual(getSemanticConvention(add, 'README.md'), CONVENTIONAL_TYPE.DOCS);
    assert.strictEqual(getSemanticConvention(add, 'tests/foo.js'), CONVENTIONAL_TYPE.TEST);

    assert.strictEqual(getSemanticConvention(add, 'foo.txt'), CONVENTIONAL_TYPE.FEAT);
  });
  it('knows a deleted file is always a chore', function () {
    const del = ACTION.D;

    assert.strictEqual(getSemanticConvention(del, 'foo.txt'), CONVENTIONAL_TYPE.CHORE);
    assert.strictEqual(getSemanticConvention(del, 'README.md'), CONVENTIONAL_TYPE.CHORE);

    assert.strictEqual(getSemanticConvention(del, 'tests/foo.js'), CONVENTIONAL_TYPE.CHORE);
  });

  it('knows a renamed or moved file is always chore', function () {
    const renameOrMove = ACTION.R;

    assert.strictEqual(getSemanticConvention(renameOrMove, 'foo.txt'), CONVENTIONAL_TYPE.CHORE);
    assert.strictEqual(
      getSemanticConvention(renameOrMove, 'fuzz/foo.txt'),
      CONVENTIONAL_TYPE.CHORE
    );

    assert.strictEqual(getSemanticConvention(renameOrMove, 'README.md'), CONVENTIONAL_TYPE.CHORE);
    assert.strictEqual(
      getSemanticConvention(renameOrMove, 'docs/foo.txt'),
      CONVENTIONAL_TYPE.CHORE
    );

    assert.strictEqual(
      getSemanticConvention(renameOrMove, 'tests/foo.js'),
      CONVENTIONAL_TYPE.CHORE
    );
  });

  it('knows for a modified file that the semantic category comes from the path or is not set', function () {
    const modified = ACTION.M;

    assert.strictEqual(getSemanticConvention(modified, 'foo.txt'), CONVENTIONAL_TYPE.UNKNOWN);
    assert.strictEqual(getSemanticConvention(modified, 'fizz/foo.txt'), CONVENTIONAL_TYPE.UNKNOWN);

    assert.strictEqual(getSemanticConvention(modified, 'README.md'), CONVENTIONAL_TYPE.DOCS);
    assert.strictEqual(getSemanticConvention(modified, 'tests/foo.js'), CONVENTIONAL_TYPE.TEST);
  });
});
