export function checkAddress(hash: string, length: number): hash is `0x${string}` {
  return new RegExp(`^0x[a-fA-F0-9]{${length}}$`).test(hash);
}
