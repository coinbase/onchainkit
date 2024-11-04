/**
 * Checks if a given hash has a given length.
 * The hash must start with '0x' followed by hexadecimal characters (a-f, A-F, 0-9).
 */
function checkHashLength(hash,
// hash to be checked
length // length of hash
) {
  return new RegExp(`^0x[a-fA-F0-9]{${length}}$`).test(hash);
}
export { checkHashLength };
//# sourceMappingURL=checkHashLength.js.map
