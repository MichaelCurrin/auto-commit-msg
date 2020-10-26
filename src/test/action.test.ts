import * as assert from 'assert';

import { moveOrRenameFile } from '../generate/action';

describe('Desribe a file moved or renamed', function() {
  describe('#moveOrRenameFile()', function() {
    it('can describe a renamed file', function() {
      assert.strictEqual(moveOrRenameFile('foo.txt', 'bar.txt'), 'Rename foo.txt to bar.txt');
      assert.strictEqual(
        moveOrRenameFile('buzz/foo.txt', 'buzz/bar.txt'),
        'Rename foo.txt to bar.txt'
      );
    });

    it('can describe a moved file', function() {
      assert.strictEqual(moveOrRenameFile('buzz/foo.txt', 'fizz/foo.txt'), 'Move foo.txt to fizz');
      assert.strictEqual(moveOrRenameFile('buzz/foo.txt', 'foo.txt'), 'Move foo.txt to repo root');
    });

    it('can describe a remamed and moved file', function() {
      assert.strictEqual(
        moveOrRenameFile('foo.txt', 'fizz/bar.txt'),
        'Move and rename foo.txt to fizz/bar.txt'
      );
      // This is a rare case, so don't bother trying to handle it smarter around paths.
      assert.strictEqual(
        moveOrRenameFile('fuzz/foo.txt', 'fizz/bar.txt'),
        'Move and rename foo.txt to fizz/bar.txt'
      );
      assert.strictEqual(
        moveOrRenameFile('fizz/foo.txt', 'bar.txt'),
        'Move and rename foo.txt to bar.txt at repo root'
      );
    });
  });
});
