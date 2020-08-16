import * as assert from 'assert';
import { Semantic } from '../generate/semantic';

describe('Test semantic commit logic', function() {
  describe('#isDocRelated()', function() {
    it('determines README.md is a doc', function() {
      assert.equal(new Semantic('README.md').isDocRelated(), true);
      assert.equal(new Semantic('FEEDME.md').isDocRelated(), false);
    });

    it('determines docs file is a doc', function() {
      assert.equal(new Semantic('docs/fizz.md').isDocRelated(), true);
      assert.equal(new Semantic('docs/foo.img').isDocRelated(), true);

      assert.equal(new Semantic('fuzz/fizz.md').isDocRelated(), false);
    });
  });
});
