import * as assert from 'assert';

import { pathToPath } from '../generate/action';

describe('Generate info about the file change action', function() {
  describe('#pathToPath()', function() {
    it('to show two files correctly', function() {
      assert.equal(pathToPath('foo.txt', 'bar.txt'), 'foo.txt to bar.txt');
    });
  });
});
