/**
 * Parse an existing commit message.
 *
 * This allows the pieces to be reused in the new message.
 */

/*
 * Split message into prefix and description.
 *
 * Require a colon to exist to detect type prefix. i.e. 'ci' will be considered a description, but
 * 'ci:' will be considered a prefix. This keeps the check simpler as we don't have to match against
 * every type and we don't have to check if we are part of a word e.g. 'circus'.
 *
 * If there is no colon to indicate a type prefix, but the message looks like a Jira prefix like
 * '[ABCD-123]', then use that as a custom prefix.
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
 * Split a prefix (before a colon) into a custom prefix and Conventional Commit type prefix.
 */
function _splitPrefixes(value: string) {
  const [customPrefix, typePrefix] =
    value !== "" && value.includes(" ") ? value.split(" ", 2) : ["", value];

  return { customPrefix, typePrefix };
}

/**
 * Separate a message prefixs if any and the description.
 */
export function splitMsg(msg: string) {
  const { prefix, description } = _splitPrefixDesc(msg);
  const { customPrefix, typePrefix } = _splitPrefixes(prefix);

  return { customPrefix, typePrefix, description: description.trim() };
}
