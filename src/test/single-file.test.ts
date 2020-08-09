import * as assert from 'assert';

import { one, move } from '../message';

describe('Generate commit message for a single changed file', function() {
  describe('#one()', function() {
    it('should return the appropriate commit message for a new file', function() {
      assert.equal(one('new file', 'foo.txt'), 'Create foo.txt');
    });

    it('should return the appropriate commit message for a modified file', function() {
      assert.equal(one('modified', 'foo.txt'), 'Update foo.txt');
    });

    it('should return the appropriate commit message for a deleted file', function() {
      assert.equal(one('delete', 'foo.txt'), 'Delete foo.txt');
    });
  });

  describe('#move()', function() {
    it('should return the appropriate commit message for a renamed file', function() {
      assert.equal(move('foo.txt', 'bar.txt'), 'Rename foo.txt to bar.txt');
    });
  });
});
