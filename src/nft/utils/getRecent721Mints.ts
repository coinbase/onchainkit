import { parseAbiItem } from 'viem';
import { mainnet } from 'viem/chains';
import type { GetRecentMints, MintEvent } from '../types';
import { getChainPublicClient } from '../../network/getChainPublicClient';

// ERC721 Transfer event ABI
const transferEventAbi = parseAbiItem(
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
);

export const getRecent721Mints = async ({
  contractAddress,
  count,
  chain = mainnet,
}: GetRecentMints): Promise<MintEvent[]> => {
  const client = getChainPublicClient(chain);

  try {
    // Get the current block number
    const toBlock = await client.getBlockNumber();
    const fromBlock = toBlock - 1000n; // Look back 1000 blocks

    // Fetch Transfer events
    const logs = await client.getLogs({
      address: contractAddress,
      event: transferEventAbi,
      args: { from: '0x0000000000000000000000000000000000000000' },
      fromBlock,
      toBlock,
    });

    const mintEvents = logs
      .map(
        (log) =>
          ({
            to: log.args.to,
            tokenId: log.args.tokenId,
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
          }) as MintEvent,
      )
      .sort((a, b) => Number(b.blockNumber - a.blockNumber));

    // return the most recent 'count' number of mints
    return mintEvents.slice(0, count);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    return [];
  }
};
