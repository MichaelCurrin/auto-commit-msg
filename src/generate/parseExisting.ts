/**
 * Parse an existing commit message.
 *
 * This allows the pieces to be reused in the new message.
 */
import { MsgPieces } from "./parseExisting.d";

/*
 * Split commit message into prefixes (custom and type) and description.
 *
 * Require a colon to exist to detect type prefix. i.e. 'ci' will be considered
 * a description, but 'ci:' will be considered a prefix. This keeps the check
 * simpler as we don't have to match against every type and we don't have to
 * check if we are part of a word e.g. 'circus'.
 *
 * Warning - trimming prefixes here causes issues elsewhere and I don't know
 * why.
 */
export function _splitPrefixesAndDesc(value: string) {
  let prefixes = "";
  let description = "";

  if (value.includes(":")) {
    [prefixes, description] = value.split(":", 2);
  } else {
    description = value;
  }
  description = description.trim();

  return { prefixes, description };
}

/**
 * Split a prefix value into more granular prefixes.
 *
 * Expect the input value to be the part before a colon in a commit message.
 *
 * Formatted as:
 *   - The Conventional Commit type prefix is the last word. This is just kept
 *     as a string and here and not validated or with type enforce.
 *   - The custom prefix will be one or more words before the type prefix
 *     (multiple words would not be be typical though). This might be a Jira
 *     identifier or project name.
 */
export function _splitPrefixes(value: string) {
  let customPrefix: string;
  let typePrefix: string;

  if (value && value.includes(" ")) {
    const items = value.split(" ");
    customPrefix = items.slice(0, -1).join(" ");
    typePrefix = items.slice(-1)[0];
  } else {
    customPrefix = "";
    typePrefix = value;
  }

  return { customPrefix, typePrefix };
}

/**
 * Separate a commit message into prefixes and a description.
 * TODO: return type
 */
export function splitMsg(msg: string): MsgPieces {
  const { prefixes, description } = _splitPrefixesAndDesc(msg);
  const { customPrefix, typePrefix } = _splitPrefixes(prefixes);

  return { customPrefix, typePrefix, description: description.trim() };
}
