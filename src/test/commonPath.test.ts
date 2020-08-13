import * as assert from 'assert';

import { commonPath } from '../generate/commonPath';

describe('Path handling', function() {
  // This is useful when building a change message about multiple files and seeing what the high
  // common level is between them so this can be used in the message. If the parent directory
  // is needed for that to keep it much shorter, that is easy from the std lib.
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
});
