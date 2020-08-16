import * as assert from 'assert';

import { moveRenamePath } from '../generate/action';

describe('Desribe a file moved or renamed', function() {
  describe('#moveRenamePath()', function() {
    it('can describe a renamed file', function() {
      assert.equal(moveRenamePath('foo.txt', 'bar.txt'), 'Rename foo.txt to bar.txt');
      assert.equal(moveRenamePath('buzz/foo.txt', 'buzz/bar.txt'), 'Rename foo.txt to bar.txt');
    });

    it('can describe a moved file', function() {
      assert.equal(moveRenamePath('buzz/foo.txt', 'fizz/foo.txt'), 'Move foo.txt to fizz');
      assert.equal(moveRenamePath('buzz/foo.txt', 'foo.txt'), 'Move foo.txt to repo root');
    });

    it('can describe a remamed and moved file', function() {
      assert.equal(moveRenamePath('foo.txt', 'fizz/bar.txt'), 'Move and rename foo.txt to fizz/bar.txt');
      // This is a rare case, so don't bother trying to handle it smarter around paths.
      assert.equal(moveRenamePath('fuzz/foo.txt', 'fizz/bar.txt'), 'Move and rename foo.txt to fizz/bar.txt');
      assert.equal(moveRenamePath('fizz/foo.txt', 'bar.txt'), 'Move and rename foo.txt to bar.txt at repo root');
    });
  });
});
