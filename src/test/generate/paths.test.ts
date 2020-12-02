import * as assert from 'assert';
import { formatPath, splitPath } from '../../generate/paths';

describe('Path handling', function () {
  describe('#splitPath()', function () {
    it('splits a path correctly', function () {
      assert.deepStrictEqual(splitPath('baz.txt'), {
        atRoot: true,
        dirPath: 'repo root',
        name: 'baz.txt',
        extension: '.txt',
      });

      assert.deepStrictEqual(splitPath('foo/bar/baz.txt'), {
        atRoot: false,
        dirPath: 'foo/bar',
        name: 'baz.txt',
        extension: '.txt',
      });
    });
  });

  describe('#formatPath()', function () {
    it('formats a long path as a filename only', function () {
      assert.strictEqual(
        formatPath('baz.txt'),
        'baz.txt'
      );
      assert.strictEqual(
        formatPath('bazz/baz.txt'),
        'baz.txt'
      );
    });

    it('formats a README file as a full path', function () {
      assert.strictEqual(
        formatPath('README.md'),
        'README.md'
      );
      assert.strictEqual(
        formatPath('foo/README.md'),
        'foo/README.md'
      );
      assert.strictEqual(
        formatPath('bar/readme.txt'),
        'bar/readme.txt'
      );
    });

    it('formats an index file as a full path', function () {
      assert.strictEqual(
        formatPath('foo/index.md'),
        'foo/index.md'
      );
      assert.strictEqual(
        formatPath('foo/index.html'),
        'foo/index.html'
      );
      assert.strictEqual(
        formatPath('foo/index.js'),
        'foo/index.js'
      );
    });
  });
});
