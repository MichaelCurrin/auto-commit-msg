import { CONVENTIONAL_TYPE } from "./lib/constants";

/**
 * Conventional Commit Message standard components, but reduced.
 *
 * See documentation in this project:
 *   docs/manual/conventional-commits.md
 *
 * For simplicity, scope is used inside the typePrefix rather than a separate
 * attribute - see the docstring on `CONVENTIONAL_TYPE`.
 */
export type ConvCommitMsg = {
  typePrefix: CONVENTIONAL_TYPE;
  description: string;
};
