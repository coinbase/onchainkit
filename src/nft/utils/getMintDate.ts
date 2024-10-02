import { type Chain, parseAbiItem } from 'viem';
import { mainnet } from 'viem/chains';
import { getChainPublicClient } from '../../network/getChainPublicClient';

// ERC721 Transfer event ABI
const transferEventAbi = parseAbiItem(
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
);

type GetMintDateParams = {
  contractAddress: `0x${string}`;
  tokenId?: string;
  chain?: Chain;
};

export const getMintDate = async ({
  contractAddress,
  tokenId,
  chain = mainnet,
}: GetMintDateParams): Promise<Date | null> => {
  const client = getChainPublicClient(chain);

  if (!tokenId) {
    return null;
  }

  try {
    const toBlock = await client.getBlockNumber();
    const fromBlock = toBlock - 5000n;

    // fetch Transfer event logs where 'from' is the zero address and 'tokenId' matches
    const logs = await client.getLogs({
      address: contractAddress,
      toBlock,
      fromBlock,
      event: transferEventAbi,
      args: {
        from: '0x0000000000000000000000000000000000000000',
        tokenId: BigInt(tokenId),
      },
    });
    console.log('getMintDate logs', logs);
    if (logs.length === 0) {
      return null;
    }

    // get the block number from the first log (mint event)
    const { blockNumber } = logs[0];

    // fetch the block details to get the timestamp
    const block = await client.getBlock({ blockNumber });

    // convert the timestamp to a Date object
    return new Date(Number(block.timestamp) * 1000);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    return null;
  }
};
