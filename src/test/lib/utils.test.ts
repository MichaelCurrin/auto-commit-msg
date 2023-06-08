import * as assert from "assert";
import { ACTION } from "../../lib/constants";
import { equal } from "../../lib/utils";

test("Utility functions", function () {
  test("#equal", function () {
    test("returns true for equal values", function () {
      assert.strictEqual(equal([1, 1]), true);
      assert.strictEqual(equal([ACTION.A, ACTION.A, ACTION.A]), true);
    });

    test("returns value for different values", function () {
      assert.strictEqual(equal([1, 2]), false);
      assert.strictEqual(equal([ACTION.A, ACTION.A, ACTION.M]), false);
    });
  });
});
