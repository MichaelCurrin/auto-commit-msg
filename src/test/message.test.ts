import * as assert from 'assert';

import { one } from '../generate/message';

describe('Generate commit message for a single changed file', function() {
  describe('#one()', function() {
    it('should return the appropriate commit message for a new file', function() {
      assert.equal(one('A  foo.txt'), 'Create foo.txt');
    });

    it('should return the appropriate commit message for a modified file', function() {
      assert.equal(one(' M foo.txt'), 'Update foo.txt');
    });

    it('should return the appropriate commit message for a deleted file', function() {
      assert.equal(one('D  foo.txt'), 'Delete foo.txt');
    });

    it('should return the appropriate commit message for a renamed file', function() {
      assert.equal(one('R  foo.txt -> bar.txt'), 'Rename foo.txt to bar.txt');
    });
  });
});
