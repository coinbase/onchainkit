import type { NFTError } from '@/api/types';
import { convertIpfsToHttps } from '@/core/nft/utils/ipfs';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useNFTLifecycleContext } from '../providers/NFTLifecycleProvider';
import type { NFTData } from '../types';
import { useMintDetails } from './useMintDetails';

export function useMintData(
  contractAddress: `0x${string}`,
  tokenId?: string,
): NFTData | NFTError {
  const { updateLifecycleStatus } = useNFTLifecycleContext();
  const [error, setError] = useState<NFTError | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    if (error) {
      updateLifecycleStatus({
        statusName: 'error',
        statusData: error,
      });
    }
  }, [error, updateLifecycleStatus]);

  const { error: mintError, data: mintData } = useMintDetails({
    contractAddress,
    takerAddress: address,
    ...(tokenId ? { tokenId } : {}),
  });

  if (mintError && !error) {
    setError({
      code: 'NmMD01',
      message: mintError.message,
      error: 'Error fetching mint data',
    });
    return mintError;
  }

  return {
    name: mintData?.name,
    description: mintData?.description,
    imageUrl: convertIpfsToHttps(mintData?.imageUrl),
    animationUrl: convertIpfsToHttps(mintData?.animationUrl),
    mimeType: mintData?.mimeType,
    contractType: mintData?.contractType,
    maxMintsPerWallet:
      mintData?.maxMintsPerWallet === 0
        ? undefined
        : mintData?.maxMintsPerWallet,
    price: mintData?.price,
    mintFee: mintData?.mintFee,
    isEligibleToMint: mintData?.isEligibleToMint,
    creatorAddress: mintData?.creatorAddress,
    totalOwners: mintData?.totalOwners,
    network: mintData?.network,
  };
}
