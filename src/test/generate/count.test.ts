/**
 * Count test module
 */

import * as assert from "assert";
import { count } from '../../generate/count';

describe('count', () => {
  it('should return the action and count one file', function () {
    const expected = {
      created: 1
    }

    assert.deepStrictEqual(
      count(), expected)
  });
})
