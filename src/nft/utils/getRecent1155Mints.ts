import { parseAbiItem } from 'viem';
import { mainnet } from 'viem/chains';
import type { GetRecentMints, MintEvent } from '../types';
import { getChainPublicClient } from '../../network/getChainPublicClient';

// ERC1155 TransferSingle event ABI
const transferSingleAbi = parseAbiItem(
  'event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)',
);

export const getRecent1155Mints = async ({
  contractAddress,
  count,
  chain = mainnet,
}: GetRecentMints): Promise<MintEvent[]> => {
  const client = getChainPublicClient(chain);

  try {
    // get the current block number
    const toBlock = await client.getBlockNumber();
    const fromBlock = toBlock - 5000n; // Look back 1000 blocks

    // fetch TransferSingle events
    const logs = await client.getLogs({
      address: contractAddress,
      event: transferSingleAbi,
      args: { from: '0x0000000000000000000000000000000000000000' }, // filter for minting events
      fromBlock,
      toBlock,
    });

    const mintEvents = logs
      .map(
        (log) =>
          ({
            to: log.args.to,
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
          }) as MintEvent,
      )
      .sort((a, b) => Number(b.blockNumber - a.blockNumber)); // sort by block number, descending

    // return the most recent 'count' number of mints
    return mintEvents.slice(0, count);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    return [];
  }
};
