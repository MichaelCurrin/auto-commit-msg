import * as assert from 'assert';
import { formatPath, splitPath } from '../../lib/paths';

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
        formatPath('Baz.txt'),
        'Baz.txt'
      );
      assert.strictEqual(
        formatPath('bazz/Baz.txt'),
        'Baz.txt'
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
        formatPath('Foo/index.md'),
        'Foo/index.md'
      );
      assert.strictEqual(
        formatPath('Foo/index.html'),
        'Foo/index.html'
      );
      assert.strictEqual(
        formatPath('Foo/index.js'),
        'Foo/index.js'
      );
    });
  });
});