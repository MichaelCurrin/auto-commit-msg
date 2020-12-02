/**
 * High-level test of message is shown to the user, based on changes to one or more files.
 */
import * as assert from 'assert';
import { one } from '../../generate/message';

describe('Generate commit message for a single changed file', function () {
  // Note that git status --short expects XY format but this is for git diff-index
  // which is only X. Also there is just spaces between - no '->' symbol.
  // Note that impossible cases are not covered here, like renaming a file and the name
  // and path are unchanged, or including two file names for an add line. But validation
  // on at least file name is done.
  describe('#one()', function () {
    it('should return the appropriate commit message for a new file', function () {
      assert.strictEqual(
        one('A    foo.txt'),
        'Create foo.txt'
      );
      // Maybe create foo.txt in bar, if the dir is not too long?
      assert.strictEqual(
        one('A    bar/foo.txt'),
        'Create foo.txt');
    });

    it('should throw an error if no filepath can be output', function () {
      assert.throws(() => one('A    '));
    });

    it('should return the appropriate commit message for a modified file', function () {
      assert.strictEqual(
        one('M    foo.txt'),
        'Update foo.txt'
      );
      assert.strictEqual(
        one('M    bar/foo.txt'),
        'Update foo.txt'
      );
    });

    it('should return the appropriate commit message for a deleted file', function () {
      assert.strictEqual(
        one('D    foo.txt'),
        'Delete foo.txt'
      );
      assert.strictEqual(
        one('D    bar/foo.txt'),
        'Delete foo.txt'
      );
    });

    it('should describe a file renamed in the same directory', function () {
      assert.strictEqual(
        one('R    foo.txt          bar.txt'),
        'Rename foo.txt to bar.txt'
      );
      assert.strictEqual(
        one('R    fizz/foo.txt     fizz/bar.txt'),
        'Rename foo.txt to bar.txt'
      );
    });

    it('should describe a file moved out of the repo root', function () {
      assert.strictEqual(
        one('R    foo.txt      fizz/foo.txt'),
        'Move foo.txt to fizz'
      );
      assert.strictEqual(
        one('R    foo.txt      fizz/buzz/foo.txt'),
        'Move foo.txt to fizz/buzz'
      );
    });

    it('should describe a file moved out of a subdirectory', function () {
      assert.strictEqual(
        one('R     fizz/buzz/foo.txt    foo.txt'),
        'Move foo.txt to repo root'
      );
      assert.strictEqual(
        one('R     fizz/buzz/foo.txt    fizz/foo.txt'),
        'Move foo.txt to fizz'
      );
      assert.strictEqual(
        one('R     fizz/buzz/foo.txt      fizz/buzz/foo.txt'),
        'Move foo.txt to fizz/buzz'
      );
    });

    it('should describe a file that was both moved and renamed', function () {
      assert.strictEqual(
        one('R    foo.txt   fizz/buzz/fuzz.txt'),
        'Move and rename foo.txt to fizz/buzz/fuzz.txt'
      );
      assert.strictEqual(
        one('R    bar/foo.txt   fizz/buzz/fuzz.txt'),
        'Move and rename foo.txt to fizz/buzz/fuzz.txt'
      );
      assert.strictEqual(
        one('R    bar/foo.txt   fizz/fuzz.txt'),
        'Move and rename foo.txt to fizz/fuzz.txt'
      );
      // Maybe the from path should be longer where dest is root.
      assert.strictEqual(
        one('R    bar/foo.txt   fuzz.txt'),
        'Move and rename foo.txt to fuzz.txt at repo root'
      );
    });

    it('uses the full path to describe index files', function () {
      assert.strictEqual(
        one('A    README.md'),
        'Create README.md'
      );
      assert.strictEqual(
        one('M    README.md'),
        'Update README.md'
      );
      assert.strictEqual(
        one('D    README.md'),
        'Delete README.md'
      );

      assert.strictEqual(
        one('A    foo/README.md'),
        'Create foo/README.md'
      );
      assert.strictEqual(
        one('M    bar/baz/README.md'),
        'Update bar/baz/README.md'
      );
      assert.strictEqual(
        one('D    bar/baz/buzz/README.md'),
        'Delete bar/baz/buzz/README.md'
      );

      assert.strictEqual(
        one('A    foo/index.md'),
        'Create foo/index.md'
      );
      assert.strictEqual(
        one('A    foo/index.js'),
        'Create foo/index.js'
      );
    });
  });
});
