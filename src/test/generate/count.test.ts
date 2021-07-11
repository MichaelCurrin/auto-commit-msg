/**
 * Count test module
 */

import * as assert from "assert";
import { count } from '../../generate/count';
import { FileChanges } from "../../git/parseOutput.d";
import { ACTION } from "../../lib/constants";

describe('count', () => {
  describe('should return the correct action and count for one file', function () {
    it('should handle a created file', function () {
      const changes: FileChanges[] = [
        {
          x: ACTION.A,
          y: " ",
          from: "foo",
          to: ""
        }
      ]
      const expected = {
        create: 1
      }

      assert.deepStrictEqual(
        count(changes), expected)
    })

    it('should handle an updated file', function () {
      const changes: FileChanges[] = [
        {
          x: ACTION.M,
          y: " ",
          from: "foo",
          to: ""
        }
      ]
      const expected = {
        update: 1
      }

      assert.deepStrictEqual(
        count(changes), expected)
    })

    it('should handle a deleted file', function () {
      const changes: FileChanges[] = [
        {
          x: ACTION.D,
          y: " ",
          from: "foo",
          to: ""
        }
      ]
      const expected = {
        delete: 1
      }

      assert.deepStrictEqual(
        count(changes), expected)
    })
  });


})
