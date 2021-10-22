/**
 * Commit message pieces.
 *
 * See docs in this project:
 *   docs/manual/conventional-commits.md
 *
 * The `typePrefix` here is kept as a string type for simplicity and not having
 * to convert to `CONVENTIONAL_TYPE` too early in process where there isn't a
 * benefit.
 *
 * See also the `ConvCommitMsg` type.
 */
export type MsgPieces = {
  customPrefix: string;
  typePrefix: string;
  description: string;
};
