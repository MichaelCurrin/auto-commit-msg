/**
 * Test high-level functionality around what message is shown to user based on file changes.
 */
import * as assert from 'assert';

import { one } from '../generate/message';

describe('Generate commit message for a single changed file', function() {
  // Note that git status --short expects XY format but this is for git diff-index
  // which is only X. Also there is just spaces between - no '->' symbol.
  // Note that impossible cases are not covered here, like renaming a file and the name
  // and path are unchanged, or including two file names for an add line. But validation
  // on at least file name is done.
  describe('#one()', function() {
    it('should return the appropriate commit message for a new file', function() {
      assert.equal(one('A    foo.txt'), 'Create foo.txt');
      // Maybe create foo.txt in bar, if the dir is not too long?
      assert.equal(one('A    bar/foo.txt'), 'Create foo.txt');
    });

    it('should throw an error if no filepath can be output', function() {
      assert.throws(() => one('A    '));
    });

    it('should return the appropriate commit message for a modified file', function() {
      assert.equal(one('M    foo.txt'), 'Update foo.txt');
      assert.equal(one('M    bar/foo.txt'), 'Update foo.txt');
    });

    it('should return the appropriate commit message for a deleted file', function() {
      assert.equal(one('D    foo.txt'), 'Delete foo.txt');
      assert.equal(one('D    bar/foo.txt'), 'Delete foo.txt');
    });

    it('should describe a file renamed in the same directory', function() {
      assert.equal(one('R    foo.txt          bar.txt'), 'Rename foo.txt to bar.txt');
      assert.equal(one('R    fizz/foo.txt     fizz/bar.txt'), 'Rename foo.txt to bar.txt');
    });

    it('should describe a file moved out of the repo root', function() {
      assert.equal(one('R    foo.txt      fizz/foo.txt'), 'Move foo.txt to fizz');
      assert.equal(one('R    foo.txt      fizz/buzz/foo.txt'), 'Move foo.txt to fizz/buzz');
    });

    it('should describe a file moved out of a subdirectory', function() {
      assert.equal(one('R     fizz/buzz/foo.txt    foo.txt'), 'Move foo.txt to repo root');
      assert.equal(one('R     fizz/buzz/foo.txt    fizz/foo.txt'), 'Move foo.txt to fizz');
      assert.equal(
        one('R     fizz/buzz/foo.txt      fizz/buzz/foo.txt'),
        'Move foo.txt to fizz/buzz'
      );
    });

    it('should describe a file that was both moved and renamed', function() {
      assert.equal(
        one('R    foo.txt   fizz/buzz/fuzz.txt'),
        'Move and rename foo.txt to fizz/buzz/fuzz.txt'
      );
      assert.equal(
        one('R    bar/foo.txt   fizz/buzz/fuzz.txt'),
        'Move and rename foo.txt to fizz/buzz/fuzz.txt'
      );
      assert.equal(
        one('R    bar/foo.txt   fizz/fuzz.txt'),
        'Move and rename foo.txt to fizz/fuzz.txt'
      );
      // Maybe the from path should be longer where dest is root.
      assert.equal(
        one('R    bar/foo.txt   fuzz.txt'),
        'Move and rename foo.txt to fuzz.txt at repo root'
      );
    });
  });
});
