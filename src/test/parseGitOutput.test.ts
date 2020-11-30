import * as assert from 'assert';
import { FileChanges, parseDiffIndex, parseStatus } from '../generate/parseGitOutput';

describe('Split git status output into components', function () {
  describe('#parseStatus()', function () {
    it('should return the appropriate commit message for a new file', function () {
      const expected: FileChanges = {
        x: 'A',
        y: ' ',
        from: 'foo.txt',
        to: ''
      };
      assert.deepStrictEqual(parseStatus('A  foo.txt'), expected);
    });

    it('should return the appropriate commit message for a modified file', function () {
      const expected: FileChanges = {
        x: ' ',
        y: 'M',
        from: 'foo.txt',
        to: ''
      };
      assert.deepStrictEqual(parseStatus(' M foo.txt'), expected);
    });

    it('should return the appropriate commit message for a deleted file', function () {
      const expected: FileChanges = {
        x: 'D',
        y: ' ',
        from: 'foo.txt',
        to: ''
      };
      assert.deepStrictEqual(parseStatus('D  foo.txt'), expected);
    });

    it('should return the appropriate commit message for a renamed file', function () {
      const expected: FileChanges = {
        x: 'R',
        y: ' ',
        from: 'foo.txt',
        to: 'bar.txt'
      };
      assert.deepStrictEqual(parseStatus('R  foo.txt -> bar.txt'), expected);

      it('should return the appropriate commit message for a moved file', function () {
        const expected: FileChanges = {
          x: 'R',
          y: ' ',
          from: 'foo.txt',
          to: 'fizz/foo.txt'
        };
        assert.deepStrictEqual(parseStatus('R  foo.txt -> fizz/foo.txt'), expected);
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
      assert.deepStrictEqual(parseDiffIndex('A       foo.txt'), expected);
    });

    it('should return the appropriate commit message for a modified file', function () {
      const expected: FileChanges = {
        x: 'M',
        y: ' ',
        from: 'foo.txt',
        to: ''
      };
      assert.deepStrictEqual(parseDiffIndex('M       foo.txt'), expected);
    });

    it('should return the appropriate commit message for a deleted file', function () {
      const expected: FileChanges = {
        x: 'D',
        y: ' ',
        from: 'foo.txt',
        to: ''
      };
      assert.deepStrictEqual(parseDiffIndex('D       foo.txt'), expected);
    });

    it('should return the appropriate commit message for a renamed unchanged file', function () {
      const expected: FileChanges = {
        x: 'R',
        y: ' ',
        from: 'bar.txt',
        to: 'foo.txt'
      };
      assert.deepStrictEqual(parseDiffIndex('R100    bar.txt       foo.txt'), expected);

      it('should return the appropriate commit message for a moved file', function () {
        const expected: FileChanges = {
          x: 'R',
          y: ' ',
          from: 'bar.txt',
          to: 'fizz/foo.txt'
        };
        assert.deepStrictEqual(parseDiffIndex('R100    bar.txt       fizz/foo.txt'), expected);
      });
    });

    it('should return the appropriate commit message for a renamed slightly changed file', function () {
      const expected: FileChanges = {
        x: 'R',
        y: ' ',
        from: 'bar.txt',
        to: 'foo.txt'
      };
      assert.deepStrictEqual(parseDiffIndex('R096    bar.txt       foo.txt'), expected);

      it('should return the appropriate commit message for a moved file', function () {
        const expected: FileChanges = {
          x: 'R',
          y: ' ',
          to: 'bar.txt',
          from: 'fizz/foo.txt'
        };
        assert.deepStrictEqual(parseDiffIndex('R096    bar.txt       fizz/foo.txt'), expected);
      });
    });
  });
});
