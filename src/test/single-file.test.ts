import * as assert from 'assert';

import { one } from '../message';

describe('Generate commit message for a single changed file', function() {
  describe('#one()', function() {
    it('should return the appropriate commit message for a new file', function() {
      // Message based on git status long.
      const result = one('new file', 'foo,txt');
      assert.equal(result, 'Create foo.txt');
    });
  });
});
