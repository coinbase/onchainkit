/**
 * Checks if a given hash has a given length.
 * The hash must start with '0x' followed by hexadecimal characters (a-f, A-F, 0-9).
 */
export function checkHashLength(
  hash: string, // hash to be checked
  length: number, // length of hash
): hash is `0x${string}` {
  return new RegExp(`^0x[a-fA-F0-9]{${length}}$`).test(hash);
}
