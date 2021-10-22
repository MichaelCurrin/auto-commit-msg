/**
 * Commit message pieces.
 *
 * See docs in this project:
 *   docs/manual/conventional-commits.md
 *
 * The `typePrefix` here is kept as a string type for simplicity and not having
 * to convert to `CONVENTIONAL_TYPE` too early in process where there isn't a
 * benefit. Also, when this is used to parse an existing message, there is no
 * guarantee that the user's type prefix is one of the expected types.
 *
 * See also the `ConvCommitMsg` type.
 */
export type MsgPieces = {
  customPrefix: string;
  typePrefix: string;
  description: string;
};
