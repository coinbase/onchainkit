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

export const L2OutputOracleABI = [
  {
    inputs: [
      { internalType: 'uint256', name: '_submissionInterval', type: 'uint256' },
      { internalType: 'uint256', name: '_l2BlockTime', type: 'uint256' },
      {
        internalType: 'uint256',
        name: '_startingBlockNumber',
        type: 'uint256',
      },
      { internalType: 'uint256', name: '_startingTimestamp', type: 'uint256' },
      { internalType: 'address', name: '_proposer', type: 'address' },
      { internalType: 'address', name: '_challenger', type: 'address' },
      {
        internalType: 'uint256',
        name: '_finalizationPeriodSeconds',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint8', name: 'version', type: 'uint8' },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'outputRoot',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'l2OutputIndex',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'l2BlockNumber',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'l1Timestamp',
        type: 'uint256',
      },
    ],
    name: 'OutputProposed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'prevNextOutputIndex',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'newNextOutputIndex',
        type: 'uint256',
      },
    ],
    name: 'OutputsDeleted',
    type: 'event',
  },
  {
    inputs: [],
    name: 'CHALLENGER',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'FINALIZATION_PERIOD_SECONDS',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'L2_BLOCK_TIME',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PROPOSER',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SUBMISSION_INTERVAL',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_l2BlockNumber', type: 'uint256' },
    ],
    name: 'computeL2Timestamp',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_l2OutputIndex', type: 'uint256' },
    ],
    name: 'deleteL2Outputs',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_l2OutputIndex', type: 'uint256' },
    ],
    name: 'getL2Output',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'outputRoot', type: 'bytes32' },
          { internalType: 'uint128', name: 'timestamp', type: 'uint128' },
          { internalType: 'uint128', name: 'l2BlockNumber', type: 'uint128' },
        ],
        internalType: 'struct Types.OutputProposal',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_l2BlockNumber', type: 'uint256' },
    ],
    name: 'getL2OutputAfter',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'outputRoot', type: 'bytes32' },
          { internalType: 'uint128', name: 'timestamp', type: 'uint128' },
          { internalType: 'uint128', name: 'l2BlockNumber', type: 'uint128' },
        ],
        internalType: 'struct Types.OutputProposal',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_l2BlockNumber', type: 'uint256' },
    ],
    name: 'getL2OutputIndexAfter',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_startingBlockNumber',
        type: 'uint256',
      },
      { internalType: 'uint256', name: '_startingTimestamp', type: 'uint256' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'latestBlockNumber',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'latestOutputIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextBlockNumber',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextOutputIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '_outputRoot', type: 'bytes32' },
      { internalType: 'uint256', name: '_l2BlockNumber', type: 'uint256' },
      { internalType: 'bytes32', name: '_l1BlockHash', type: 'bytes32' },
      { internalType: 'uint256', name: '_l1BlockNumber', type: 'uint256' },
    ],
    name: 'proposeL2Output',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'startingBlockNumber',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'startingTimestamp',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'latestL2Output',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'outputRoot', type: 'bytes32' },
          { internalType: 'uint128', name: 'timestamp', type: 'uint128' },
          { internalType: 'uint128', name: 'l2BlockNumber', type: 'uint128' },
        ],
        internalType: 'struct Types.OutputProposal',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const OptimismPortalABI = [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'receive',
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'balance',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'depositERC20Transaction',
    inputs: [
      {
        name: '_to',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_mint',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_value',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_gasLimit',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: '_isCreation',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: '_data',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'depositTransaction',
    inputs: [
      {
        name: '_to',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_gasLimit',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: '_isCreation',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: '_data',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'donateETH',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'finalizeWithdrawalTransaction',
    inputs: [
      {
        name: '_tx',
        type: 'tuple',
        internalType: 'struct Types.WithdrawalTransaction',
        components: [
          {
            name: 'nonce',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'sender',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'target',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'gasLimit',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'finalizedWithdrawals',
    inputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'guardian',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [
      {
        name: '_l2Oracle',
        type: 'address',
        internalType: 'contract OutputOracle',
      },
      {
        name: '_systemConfig',
        type: 'address',
        internalType: 'contract ISystemConfig',
      },
      {
        name: '_superchainConfig',
        type: 'address',
        internalType: 'contract ISuperchainConfig',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isOutputFinalized',
    inputs: [
      {
        name: '_l2OutputIndex',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'l2Oracle',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract OutputOracle',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'l2Sender',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'minimumGasLimit',
    inputs: [
      {
        name: '_byteCount',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'params',
    inputs: [],
    outputs: [
      {
        name: 'prevBaseFee',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'prevBoughtGas',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: 'prevBlockNum',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'paused',
    inputs: [],
    outputs: [
      {
        name: 'paused_',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'proveAndFinalizeWithdrawalTransaction',
    inputs: [
      {
        name: '_tx',
        type: 'tuple',
        internalType: 'struct Types.WithdrawalTransaction',
        components: [
          {
            name: 'nonce',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'sender',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'target',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'gasLimit',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
      {
        name: '_l2OutputIndex',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_outputRootProof',
        type: 'tuple',
        internalType: 'struct Types.OutputRootProof',
        components: [
          {
            name: 'version',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'stateRoot',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'messagePasserStorageRoot',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'latestBlockhash',
            type: 'bytes32',
            internalType: 'bytes32',
          },
        ],
      },
      {
        name: '_withdrawalProof',
        type: 'bytes[]',
        internalType: 'bytes[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'proveWithdrawalTransaction',
    inputs: [
      {
        name: '_tx',
        type: 'tuple',
        internalType: 'struct Types.WithdrawalTransaction',
        components: [
          {
            name: 'nonce',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'sender',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'target',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'gasLimit',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'data',
            type: 'bytes',
            internalType: 'bytes',
          },
        ],
      },
      {
        name: '_l2OutputIndex',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_outputRootProof',
        type: 'tuple',
        internalType: 'struct Types.OutputRootProof',
        components: [
          {
            name: 'version',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'stateRoot',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'messagePasserStorageRoot',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'latestBlockhash',
            type: 'bytes32',
            internalType: 'bytes32',
          },
        ],
      },
      {
        name: '_withdrawalProof',
        type: 'bytes[]',
        internalType: 'bytes[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setGasPayingToken',
    inputs: [
      {
        name: '_token',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_decimals',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: '_name',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: '_symbol',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'superchainConfig',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract ISuperchainConfig',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'systemConfig',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract ISystemConfig',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'version',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint8',
        indexed: false,
        internalType: 'uint8',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TransactionDeposited',
    inputs: [
      {
        name: 'from',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'to',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'version',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'opaqueData',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'WithdrawalFinalized',
    inputs: [
      {
        name: 'withdrawalHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'success',
        type: 'bool',
        indexed: false,
        internalType: 'bool',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'WithdrawalProven',
    inputs: [
      {
        name: 'withdrawalHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'from',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'to',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'BadTarget',
    inputs: [],
  },
  {
    type: 'error',
    name: 'CallPaused',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ContentLengthMismatch',
    inputs: [],
  },
  {
    type: 'error',
    name: 'EmptyItem',
    inputs: [],
  },
  {
    type: 'error',
    name: 'GasEstimation',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidDataRemainder',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidHeader',
    inputs: [],
  },
  {
    type: 'error',
    name: 'LargeCalldata',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NoValue',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NonReentrant',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OnlyCustomGasToken',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OutOfGas',
    inputs: [],
  },
  {
    type: 'error',
    name: 'SmallGasLimit',
    inputs: [],
  },
  {
    type: 'error',
    name: 'TransferFailed',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Unauthorized',
    inputs: [],
  },
  {
    type: 'error',
    name: 'UnexpectedList',
    inputs: [],
  },
  {
    type: 'error',
    name: 'UnexpectedString',
    inputs: [],
  },
] as const;

export const L2_TO_L1_MESSAGE_PASSER_ABI = [
  {
    type: 'function',
    name: 'initiateWithdrawal',
    inputs: [
      {
        name: '_target',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_gasLimit',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
] as const;
