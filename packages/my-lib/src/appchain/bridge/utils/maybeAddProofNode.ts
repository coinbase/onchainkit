import { type Hex, fromRlp, toRlp } from 'viem';

/* v8 ignore start */
export function maybeAddProofNode(key: string, proof: readonly Hex[]) {
  const lastProofRlp = proof[proof.length - 1];
  const lastProof = fromRlp(lastProofRlp);
  if (lastProof.length !== 17) {
    return proof;
  }

  const modifiedProof = [...proof];
  for (const item of lastProof) {
    // Find any nodes located inside of the branch node.
    if (!Array.isArray(item)) {
      continue;
    }
    // Check if the key inside the node matches the key we're looking for. We remove the first
    // two characters (0x) and then we remove one more character (the first nibble) since this
    // is the identifier for the type of node we're looking at. In this case we don't actually
    // care what type of node it is because a branch node would only ever be the final proof
    // element if (1) it includes the leaf node we're looking for or (2) it stores the value
    // within itself. If (1) then this logic will work, if (2) then this won't find anything
    // and we won't append any proof elements, which is exactly what we would want.
    const suffix = item[0].slice(3);
    if (typeof suffix !== 'string' || !key.endsWith(suffix)) {
      continue;
    }
    modifiedProof.push(toRlp(item));
  }
  return modifiedProof;
}
/* v8 ignore stop */
