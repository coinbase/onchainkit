export const ID_REGISTRY_ADDRESS = '0x00000000Fc6c5F01Fc30151999387Bb99A9f489b';

/**
 * Auth addresses are not on chain -- they are verifications held by the hubs -- so
 * validating a `type: "auth"` association needs a hub to ask.
 */
export const FARCASTER_HUB_URL = 'https://snap.farcaster.xyz:3381';

export const ID_REGISTRY_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'idOf',
    outputs: [{ internalType: 'uint256', name: 'fid', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'fid', type: 'uint256' }],
    name: 'custodyOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
