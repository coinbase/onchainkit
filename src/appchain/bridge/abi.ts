export const DeployChainABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'chainID',
        type: 'uint256',
      },
    ],
    name: 'deployAddresses',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'l2OutputOracle',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'systemConfig',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'optimismPortal',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'l1CrossDomainMessenger',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'l1StandardBridge',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'l1ERC721Bridge',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'optimismMintableERC20Factory',
            type: 'address',
          },
        ],
        internalType: 'struct DeployChain.DeployAddresses',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const StandardBridgeABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        internalType: 'uint32',
        name: '_minGasLimit',
        type: 'uint32',
      },
      {
        internalType: 'bytes',
        name: '_extraData',
        type: 'bytes',
      },
    ],
    name: 'bridgeETHTo',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_localToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_remoteToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint32',
        name: '_minGasLimit',
        type: 'uint32',
      },
      {
        internalType: 'bytes',
        name: '_extraData',
        type: 'bytes',
      },
    ],
    name: 'bridgeERC20To',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const ERC20ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
] as const;
