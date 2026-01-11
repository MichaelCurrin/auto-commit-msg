/**
 * Conventional commit module.
 *
 * Categorize changes of a path using the Conventional Commit standard like `fix`.
 *
 * Here all as functions. But rewriting all as classes might be lower lift and okay.
* Maybe first pass it just rewriting class.method calls in tests (as a new test file) as function
calls with data.
 */

import { CONVENTIONAL_TYPE } from "../lib/constants";

const CI_CRITERIA = {
  dirs: {
    // includes: [],
    // startsWith: [],
    equals: [
      ".circleci",
      ".github/workflows",
    ],
  },
  // extensions: {
  //   equals: [],
  // },
  names: {
    includes: [
      "netlify.toml",
      "travis.yml",
      "tox.ini",
    ],
    // startsWith: [],
    // equals: [],
  },
};

function related(criteria) {
  return true;
}

function main() {
  if (related(CI_CRITERIA) === true) {
    return CONVENTIONAL_TYPE.CI;
  }
}
