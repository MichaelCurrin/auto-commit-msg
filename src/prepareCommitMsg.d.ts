import { CONVENTIONAL_TYPE } from "./lib/constants";

/**
 * Components of the Conventional Commit Message standard.
 *
 * For simplicity in this project, the `scope` is ignored and no body or footer
 * messages are used.
 */
export type ConvCommitMsg = {
  typePrefix: CONVENTIONAL_TYPE;
  description: string;
};
