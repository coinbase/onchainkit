import { type UseReadContractsReturnType, useReadContracts } from 'wagmi';
import { erc721Abi, parseAbi } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { type Metadata, getMetadata } from '../utils/getMetadata';

const ERC1155_URI_ABI = parseAbi([
  'function uri(uint256 tokenId) view returns (string)',
]);

type UseMetadataOptions = {
  contractAddress: `0x${string}`;
  tokenId: string;
};

export const useMetadata = ({
  contractAddress,
  tokenId,
}: UseMetadataOptions) => {
  const result: UseReadContractsReturnType = useReadContracts({
    contracts: [
      {
        address: contractAddress,
        abi: erc721Abi,
        functionName: 'tokenURI',
        args: [BigInt(tokenId)],
      },
      {
        address: contractAddress,
        abi: ERC1155_URI_ABI,
        functionName: 'uri',
        args: [BigInt(tokenId)],
      },
    ],
  });

  const [tokenUriResult, uriResult] = result?.data ?? [];
  const tokenUri =
    (tokenUriResult?.result as string) ?? (uriResult?.result as string) ?? null;

  const actionKey = `useMetadata-${contractAddress}-${tokenId}`;
  return useQuery<Metadata | null>({
    queryKey: ['useMintDate', actionKey],
    queryFn: async () => {
      if (tokenUri) {
        return await getMetadata({ tokenUri });
      }
      return null;
    },
    enabled: result?.isSuccess && Boolean(tokenUri),
    refetchOnWindowFocus: false,
  });
};
