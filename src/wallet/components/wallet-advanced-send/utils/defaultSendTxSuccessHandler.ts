import { getChainExplorer } from '@/core/network/getChainExplorer';
import type { Address, Chain, TransactionReceipt } from 'viem';
import { useChainId } from 'wagmi';

export function defaultSendTxSuccessHandler({
  transactionId,
  transactionHash,
  senderChain,
  address,
  onComplete,
}: {
  transactionId: string | undefined;
  transactionHash: string | undefined;
  senderChain: Chain | undefined;
  address: Address | undefined;
  onComplete?: () => void;
}) {
  return (receipt: TransactionReceipt | undefined) => {
    const accountChainId = senderChain?.id ?? useChainId();

    // SW will have txn id so open in wallet
    if (
      receipt &&
      transactionId &&
      transactionHash &&
      senderChain?.id &&
      address
    ) {
      const url = new URL('https://wallet.coinbase.com/assets/transactions');
      url.searchParams.set('contentParams[txHash]', transactionHash);
      url.searchParams.set(
        'contentParams[chainId]',
        JSON.stringify(senderChain?.id),
      );
      url.searchParams.set('contentParams[fromAddress]', address);
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // EOA will not have txn id so open in explorer
      const chainExplorer = getChainExplorer(accountChainId);
      window.open(
        `${chainExplorer}/tx/${transactionHash}`,
        '_blank',
        'noopener,noreferrer',
      );
    }

    // After opening the transaction in the wallet or explorer, take an action (default: close the send modal)
    onComplete?.();
  };
}
