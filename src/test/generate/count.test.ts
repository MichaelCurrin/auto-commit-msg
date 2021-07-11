/**
 * Count test module
 */

import * as assert from "assert";
import { count } from '../../generate/count';
import { FileChanges } from "../../git/parseOutput.d";
import { ACTION } from "../../lib/constants";

describe('count', () => {
  it('should return the action and count one file', function () {
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
  });
})
