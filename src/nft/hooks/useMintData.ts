import { useMemo } from 'react';
import type { NFTData, NFTError } from '../types';
import { isNFTError } from '../utils/isNFTError';
import { useNFTLifecycleContext } from '../components/NFTLifecycleProvider';
import { useMintDetails } from './useMintDetails';
import { useAccount } from 'wagmi';

export function useMintData(
  contractAddress: `0x${string}`,
  tokenId?: string,
): NFTData | NFTError {
  const { updateLifecycleStatus } = useNFTLifecycleContext();
  const { address } = useAccount();

  const { data: mintData } = useMintDetails({
    contractAddress,
    takerAddress: address,
    tokenId: tokenId,
  });

  if (isNFTError(mintData)) {
    updateLifecycleStatus({
      statusName: 'error',
      statusData: {
        code: mintData.code,
        error: mintData.error,
        message: mintData.message,
      },
    });
    return mintData;
  }

  return useMemo(
    () => ({
      contractAddress,
      tokenId,
      name: mintData?.name,
      description: mintData?.description,
      imageUrl: mintData?.imageUrl,
      animationUrl: mintData?.animationUrl,
      mimeType: mintData?.mimeType,
      maxMintsPerWallet: mintData?.maxMintsPerWallet,
      price: mintData?.price,
      mintFee: mintData?.mintFee,
      isEligibleToMint: mintData?.isEligibleToMint,
      creatorAddress: mintData?.creatorAddress,
      totalOwners: mintData?.totalOwners,
      network: mintData?.network,
    }),
    [contractAddress, mintData, tokenId],
  );
}
