import { background, cn } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { LifecycleType, type NftMintReact } from '../types';
import { NftViewProvider } from './NftViewProvider';
import { NftMintProvider } from './NftMintProvider';
import { NftQuantityProvider } from './NftQuantityProvider';
import { NftLifecycleProvider } from './NftLifecycleProvider';

export function NftMint({
  children,
  className,
  contractAddress,
  tokenId = '1',
  onStatus,
  onError,
  onSuccess,
}: NftMintReact) {
  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <NftLifecycleProvider
      type={LifecycleType.MINT}
      onStatus={onStatus}
      onError={onError}
      onSuccess={onSuccess}
    >
      <NftViewProvider contractAddress={contractAddress} tokenId={tokenId}>
        <NftMintProvider contractAddress={contractAddress} tokenId={tokenId}>
          <NftQuantityProvider>
            <div
              className={cn(
                background.default,
                'flex w-[500px] flex-col rounded-xl border px-6 pt-6 pb-4',
                className,
              )}
              data-testid="ockNftMint_Container"
            >
              {children}
            </div>
          </NftQuantityProvider>
        </NftMintProvider>
      </NftViewProvider>
    </NftLifecycleProvider>
  );
}
