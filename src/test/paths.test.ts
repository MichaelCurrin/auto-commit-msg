import * as assert from 'assert';

import { commonPath, removeBase, splitPath } from '../generate/paths';

describe('Path handling', function() {
  describe('#commonPath()', function() {
    it('should give the highest common parent directory for 3 related absolute paths', function() {
      const paths = [
        '/home/user1/tmp/coverage/test',
        '/home/user1/tmp/covert/operator',
        '/home/user1/tmp/coven/members'
      ];

      assert.equal(commonPath(paths), '/home/user1/tmp');
    });

    it('should give the highest common parent directory for 3 related repo paths', function() {
      const paths = [
        'fizz/buzz/coverage/test',
        'fizz/buzz/covert/operator',
        'fizz/buzz/tmp/coven/members'
      ];

      assert.equal(commonPath(paths), 'fizz/buzz');
    });

    it('should give the highest common parent directory for 3 top-level repo paths', function() {
      const paths = [ 'foo', 'bar', 'fizz/buzz' ];

      assert.equal(commonPath(paths), 'repo root');
    });

    it('should give the highest common parent directory for two different paths', function() {
      const paths = [ '/foo/test', '/foo/bar/test' ];

      assert.equal(commonPath(paths), '/foo');
    });

    it('should give the highest common parent directory for two different paths', function() {
      const paths = [ 'Foo/test', 'Foo/bar/test' ];

      assert.equal(commonPath(paths), 'Foo');
    });
  });

  describe('#removeBase()', function() {
    it('Removes a base', function() {
      assert.equal(removeBase('/foo/bar', '/foo/bar/baz.txt'), '/baz.txt');
    });

    // For future reference but not useful now.
    it('Finds the difference between two paths with common base', function() {
      const a = '/foo/bar/baz.txt';
      const b = '/foo/bar/fizz/fuzzy/baz.txt';
      const common = commonPath([ a, b ]);

      assert.equal(common, '/foo/bar');

      assert.equal(removeBase(common, b), '/fizz/fuzzy/baz.txt');
    });
  });

  describe('#splitPath()', function() {
    it('splits a path correctly', function() {
      assert.deepEqual(splitPath('baz.txt'), {
        atRoot: true,
        dir: 'repo root',
        name: 'baz.txt',
        extension: '.txt'
      });

      assert.deepEqual(splitPath('foo/bar/baz.txt'), {
        atRoot: false,
        dir: 'foo/bar',
        name: 'baz.txt',
        extension: '.txt'
      });
    });
  });
});
