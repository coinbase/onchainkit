import { sha256 } from 'viem';

// Will return a an index between 0 and optionsLength
const getBaseDefaultProfilePictureIndex = (name, optionsLength) => {
  const nameAsUint8Array = Uint8Array.from(name.split('').map(letter => letter.charCodeAt(0)));
  const hash = sha256(nameAsUint8Array);
  const hashValue = Number.parseInt(hash, 16);
  const remainder = hashValue % optionsLength;
  const index = remainder;
  return index;
};
export { getBaseDefaultProfilePictureIndex };
//# sourceMappingURL=getBaseDefaultProfilePictureIndex.js.map
