import * as assert from 'assert';

import { commonPath } from '../generate/paths';

describe('Path handling', function() {
  describe('#commonPath()', function() {
    it('should give the highest common parent directory for 3 related paths', function() {
      const paths = [
        '/home/user1/tmp/coverage/test',
        '/home/user1/tmp/covert/operator',
        '/home/user1/tmp/coven/members'
      ];

      assert.equal(commonPath(paths), '/home/user1/tmp');
    });

    it('should give the highest common parent directory for two different paths', function() {
      const paths = [ '/foo/test', '/foo/bar/test' ];

      assert.equal(commonPath(paths), '/foo');
    });

    it('should give the highest common parent directory for two similar', function() {
      const paths = [ '/fizz', '/buzz' ];

      assert.equal(commonPath(paths), '');
    });
  });
});
