import * as assert from 'assert';
import { DESCRIPTION } from '../generate/constants';
import { describeCode, FileChanges, parseDiffIndex, parseStatus } from '../generate/parseGitOutput';

describe('Get value from description enum using key', function () {
  describe('#describeCode()', function () {
    it('can return the correct value for added symbol', function () {
      assert.strictEqual(describeCode('A'), 'added');

      assert.strictEqual(describeCode('A'), DESCRIPTION.A);
    });

    it('can return the correct value for empty space as unmodified', function () {
      assert.strictEqual(describeCode(' '), 'unmodified');
    });

    it('can return the correct value for ignored symbol', function () {
      assert.strictEqual(describeCode('!'), 'ignored');
    });
  });
});

describe('Split git status output into components', function () {
  describe('#parseStatus()', function () {
    it('should return the appropriate commit message for a new file', function () {
      const expected: FileChanges = {
        x: 'A',
        y: ' ',
        from: 'foo.txt',
        to: ''
      };
      assert.deepEqual(parseStatus('A  foo.txt'), expected);
    });

    it('should return the appropriate commit message for a modified file', function () {
      const expected: FileChanges = {
        x: ' ',
        y: 'M',
        from: 'foo.txt',
        to: ''
      };
      assert.deepEqual(parseStatus(' M foo.txt'), expected);
    });

    it('should return the appropriate commit message for a deleted file', function () {
      const expected: FileChanges = {
        x: 'D',
        y: ' ',
        from: 'foo.txt',
        to: ''
      };
      assert.deepEqual(parseStatus('D  foo.txt'), expected);
    });

    it('should return the appropriate commit message for a renamed file', function () {
      const expected: FileChanges = {
        x: 'R',
        y: ' ',
        from: 'foo.txt',
        to: 'bar.txt'
      };
      assert.deepEqual(parseStatus('R  foo.txt -> bar.txt'), expected);

      it('should return the appropriate commit message for a moved file', function () {
        const expected: FileChanges = {
          x: 'R',
          y: ' ',
          from: 'foo.txt',
          to: 'fizz/foo.txt'
        };
        assert.deepEqual(parseStatus('R  foo.txt -> fizz/foo.txt'), expected);
      });
    });
  });
});

describe('Split git diff-index output into components', function () {
  // The 1st column to 2nd looks like constant with and then 2nd to 3rd looks like 6 chars.
  // R100    tslint.json     src/tslint.json
  // R100    vsc-extension-quickstart.md     src/vsc-extension-quickstart.md

  describe('#parseDiffIndex()', function () {
    it('should return the appropriate commit message for a new file', function () {
      const expected: FileChanges = {
        x: 'A',
        y: ' ',
        from: 'foo.txt',
        to: ''
      };
      assert.deepEqual(parseDiffIndex('A       foo.txt'), expected);
    });

    it('should return the appropriate commit message for a modified file', function () {
      const expected: FileChanges = {
        x: 'M',
        y: ' ',
        from: 'foo.txt',
        to: ''
      };
      assert.deepEqual(parseDiffIndex('M       foo.txt'), expected);
    });

    it('should return the appropriate commit message for a deleted file', function () {
      const expected: FileChanges = {
        x: 'D',
        y: ' ',
        from: 'foo.txt',
        to: ''
      };
      assert.deepEqual(parseDiffIndex('D       foo.txt'), expected);
    });

    it('should return the appropriate commit message for a renamed unchanged file', function () {
      const expected: FileChanges = {
        x: 'R',
        y: ' ',
        from: 'bar.txt',
        to: 'foo.txt'
      };
      assert.deepEqual(parseDiffIndex('R100    bar.txt       foo.txt'), expected);

      it('should return the appropriate commit message for a moved file', function () {
        const expected: FileChanges = {
          x: 'R',
          y: ' ',
          from: 'bar.txt',
          to: 'fizz/foo.txt'
        };
        assert.deepEqual(parseDiffIndex('R100    bar.txt       fizz/foo.txt'), expected);
      });
    });

    it('should return the appropriate commit message for a renamed slightly changed file', function () {
      const expected: FileChanges = {
        x: 'R',
        y: ' ',
        from: 'bar.txt',
        to: 'foo.txt'
      };
      assert.deepEqual(parseDiffIndex('R096    bar.txt       foo.txt'), expected);

      it('should return the appropriate commit message for a moved file', function () {
        const expected: FileChanges = {
          x: 'R',
          y: ' ',
          to: 'bar.txt',
          from: 'fizz/foo.txt'
        };
        assert.deepEqual(parseDiffIndex('R096    bar.txt       fizz/foo.txt'), expected);
      });
    });
  });
});
