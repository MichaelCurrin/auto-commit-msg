import * as assert from 'assert';
import { splitPath } from '../generate/paths';

describe('Path handling', function () {
  describe('#splitPath()', function () {
    it('splits a path correctly', function () {
      assert.deepStrictEqual(splitPath('baz.txt'), {
        atRoot: true,
        dirPath: 'repo root',
        name: 'baz.txt',
        extension: '.txt'
      });

      assert.deepStrictEqual(splitPath('foo/bar/baz.txt'), {
        atRoot: false,
        dirPath: 'foo/bar',
        name: 'baz.txt',
        extension: '.txt'
      });
    });
  });
});
