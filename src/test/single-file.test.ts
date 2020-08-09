import * as assert from 'assert';

import { one } from '../message';

describe('Generate commit message for a single changed file', function() {
  describe('#one()', function() {
    it('should return the appropriate commit message for a new file', function() {
      assert.equal(one('new file', 'foo.txt'), 'Create foo.txt');

      assert.equal(one('new file', 'bar.js'), 'Create bar.js');
    });

    it('should return the appropriate commit message for a deleted file', function() {
      assert.equal(one('delete', 'foo.txt'), 'Delete foo.txt');

      assert.equal(one('delete', 'bar.js'), 'Delete bar.js');
    });
  });
});
