import { useAccount } from 'wagmi';
import { useCapabilitiesSafe } from '../../internal/hooks/useCapabilitiesSafe';
import { useOnchainKit } from '../../useOnchainKit';

// From https://github.com/wevm/wagmi/blob/472993b3c0d5941e524e67a0f51b32af5bb9e48f/packages/connectors/src/coinbaseWallet.ts#L90
const COINBASE_WALLET_SDK_CONNECTOR_ID = 'coinbaseWalletSDK';

/**
 * Checks the wallet connector ID and the wallet capabilities to determine if the currently connected wallet is a
 * Coinbase Smart Wallet.
 * @returns true if the wallet is a Coinbase Smart Wallet, false otherwise.
 */
export function useIsWalletACoinbaseSmartWallet(): boolean {
  const { chain } = useOnchainKit();
  const { connector } = useAccount();
  const walletCapabilities = useCapabilitiesSafe({
    chainId: chain.id,
  });

  return (
    connector?.id === COINBASE_WALLET_SDK_CONNECTOR_ID &&
    walletCapabilities.atomicBatch?.supported === true
  );
}
