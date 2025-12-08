/**
 * Prefixes all sequences of non-whitespace characters in a string with a given prefix.
 *
 * @param string - The string to prefix.
 * @param prefix - The prefix to add to the string.
 * @returns The prefixed string.
 */
export function prefixStringParts(string: string, prefix: string) {
  return string.replace(
    // Match any non-whitespace characters that:
    // 1. Are at the start of the string (^) OR preceded by whitespace (\s)
    // 2. Don't already start with the prefix
    new RegExp(`(^|\\s)(?!${prefix})(\\S+)`, 'g'),
    `$1${prefix}$2`,
  );
}
