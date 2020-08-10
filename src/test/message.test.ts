import * as assert from 'assert';

import { one } from '../generate/message';

describe('Generate commit message for a single changed file', function() {
  describe('#one()', function() {
    it('should return the appropriate commit message for a new file', function() {
      assert.equal(one('A    foo.txt'), 'Create foo.txt');
    });

    it('should return the appropriate commit message for a modified file', function() {
      assert.equal(one('M    foo.txt'), 'Update foo.txt');
    });

    it('should return the appropriate commit message for a deleted file', function() {
      assert.equal(one('D    foo.txt'), 'Delete foo.txt');
    });

    it('should return the appropriate commit message for a renamed file', function() {
      assert.equal(one('R    foo.txt   bar.txt'), 'Rename foo.txt to bar.txt');
    });

    // it('should return the appropriate commit message for a moved file of the same name', function() {
    // assert.equal(
    //   one('R  foo.txt -> fizz/buzz/foo.txt'),
    //   'Move foo.txt to fizz/buzz'
    // );
    // It's simplest for now to remove any common base. Esp if it goes up or down.
    // assert.equal(
    //   one('R  baz/foo.txt -> baz/fizz/buzz/foo.txt'),
    //   'Move foo.txt to baz/fizz/buzz'
    // );
    // assert.equal(
    //   one('R  fizz/buzz/foo.txt -> fizz/foo.txt'),
    //   'Move foo.txt to fizz'
    // );
    // assert.equal(
    //   one('R  baz/foo.txt -> foo.txt'),
    //   'Move foo.txt to repo root'
    // );
    // });

    // Keep as move for now, can be move and rename later.
    // it('should return the appropriate commit message for a moved file of a different name', function() {
    //   assert.equal(
    //     one('R  foo.txt -> fizz/buzz/fuzz.txt'),
    //     'Move foo.txt to fizz/buzz/fuzz.txt'
    //   );
    // });
  });
});
