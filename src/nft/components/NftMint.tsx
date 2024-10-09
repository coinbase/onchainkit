import { background, cn } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { LifecycleType, type NftMintReact } from '../types';
import { NftProvider } from './NftProvider';
import { NftMintProvider } from './NftMintProvider';
import { NftLifecycleProvider } from './NftLifecycleProvider';

export function NftMint({
  children,
  className,
  contractAddress,
  tokenId = '1',
  useNftData,
  useMintData,
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
      <NftProvider
        contractAddress={contractAddress}
        tokenId={tokenId}
        useNftData={useNftData}
      >
        <NftMintProvider useMintData={useMintData}>
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
        </NftMintProvider>
      </NftProvider>
    </NftLifecycleProvider>
  );
}
