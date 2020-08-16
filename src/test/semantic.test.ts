import * as assert from 'assert';
import { Semantic, getSemanticConvention } from '../generate/semantic';
import { CONVENTIONAL_TYPE, ACTION } from '../generate/constants';

describe('Test #Semantic class for path-based conventional commit logic', function() {
  describe('#isDocRelated()', function() {
    it('determines README.md is a doc', function() {
      assert.equal(new Semantic('README.md').isDocRelated(), true);
      assert.equal(new Semantic('FEEDME.md').isDocRelated(), false);
    });

    it('determines a file in the docs directory is a doc', function() {
      assert.equal(new Semantic('docs/fizz.md').isDocRelated(), true);
      assert.equal(new Semantic('docs/foo.img').isDocRelated(), true);

      assert.equal(new Semantic('docs/fizz/foo.img').isDocRelated(), true);

      assert.equal(new Semantic('fuzz/fizz.md').isDocRelated(), false);
    });

    describe('#isCIRelated()', function() {
      it('can tell a CI change is in a CircleCI directory', function() {
        assert.equal(new Semantic('.circleci/foo.txt').isCIRelated(), true);

        assert.equal(new Semantic('foo.txt').isCIRelated(), false);
        assert.equal(new Semantic('fizz/foo.txt').isCIRelated(), false);
      });

      it('can tell a CI change is in a workflows directory', function() {
        assert.equal(new Semantic('.github/workflows/foo.txt').isCIRelated(), true);

        assert.equal(new Semantic('foo.txt').isCIRelated(), false);
        assert.equal(new Semantic('.github/foo.txt').isCIRelated(), false);
      });

      it('can tell a CI change for a CI filename', function() {
        assert.equal(new Semantic('netlify.toml').isCIRelated(), true);
        assert.equal(new Semantic('foo/netlify.toml').isCIRelated(), true);

        assert.equal(new Semantic('foo.txt').isCIRelated(), false);
      });
    });

    describe('#getSemanticConvention()', function() {
      it('knows for a new file that category is feat (and probably not a fix), unless there is a match for it under another category', function() {
        assert.equal(getSemanticConvention(ACTION.A, 'README.md'), CONVENTIONAL_TYPE.DOCS);
        assert.equal(getSemanticConvention(ACTION.A, 'README.md'), CONVENTIONAL_TYPE.DOCS);

        assert.equal(getSemanticConvention(ACTION.A, 'foo.txt'), CONVENTIONAL_TYPE.FEAT);
      });
      it('knows a deleted file is always chore', function() {
        '';
      });
      it('knows a renamed or moved file is always chore', function() {
        '';
      });
      it('knows for a modified file that the semantic category comes from the path or not set', function() {
        '';
      });
    });
  });
});
