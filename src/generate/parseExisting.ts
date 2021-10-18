/**
 * Parse an existing commit message.
 *
 * This allows the pieces to be reused in the new message.
 */

/*
 * Split message into prefix and description.
 *
 * Require a colon to exist to detect type prefix. i.e. 'ci' will be considered
 * a description, but 'ci:' will be considered a prefix. This keeps the check
 * simpler as we don't have to match against every type and we don't have to
 * check if we are part of a word e.g. 'circus'.
 */
export function _splitPrefixDesc(value: string) {
  let prefix = "";
  let description = "";

  if (value.includes(":")) {
    [prefix, description] = value.split(":", 2);
  } else {
    description = value;
  }

  return { prefix, description };
}

/**
 * Split a prefix value into more granular prefixes.
 *
 * Expect a value that comes before a colon in a commit message and split it
 * into custom prefix and Conventional Commit type prefix, if available.
 */
export function _splitPrefixes(value: string) {
  let customPrefix: string;
  let typePrefix: string;

  if (value && value.includes(" ")) {
    [customPrefix, typePrefix] = value.split(" ", 2);
  } else {
    customPrefix = "";
    typePrefix = value;
  }

  return { customPrefix, typePrefix };
}

/**
 * Separate a message into prefixes (if any) and the description.
 */
export function splitMsg(msg: string) {
  const { prefix, description } = _splitPrefixDesc(msg);
  const { customPrefix, typePrefix } = _splitPrefixes(prefix);

  return { customPrefix, typePrefix, description: description.trim() };
}
