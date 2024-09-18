import { useQuery } from '@tanstack/react-query';
import { type Chain, mainnet } from 'viem/chains';

const SIMPLE_HASH_API = 'coinbase_sk_pdkh4jqdj5k61l7vm1q03s1xsrppr4tb';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': SIMPLE_HASH_API
};

type UseNftsByWallet = {
  address?: `0x${string}`;
  chain?: Chain; // Optional chain for domain resolution
};

type GetNftsByWalletReturnType = {
  nfts: [{
    nft_id: string;
    chain: string;
    contract_address: string;
    token_id: number;
    name: string;
    description: string;
    image_url: string;
  }]
}

type UseQueryOptions = {
  enabled?: boolean;
  cacheTime?: number;
};

export const useNftsByWallet = (
  { address, chain = mainnet }: UseNftsByWallet,
  queryOptions?: UseQueryOptions,
) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const actionKey = `useNftsByWallet-${address}-${chain.id}`;
  return useQuery<GetNftsByWalletReturnType>({
    queryKey: ['useAddress', actionKey],
    queryFn: async () => {
      return await getNftsByWallet({ address, chain });
    },
    gcTime: cacheTime,
    enabled: Boolean(address) && enabled,
    refetchOnWindowFocus: false,
  });
};


type GetNftsByWalletType = {
  address?: `0x${string}`;
  chain?: Chain;
};

export const getNftsByWallet = async ({
  address,
  chain = mainnet,
}: GetNftsByWalletType): Promise<GetNftsByWalletReturnType> => {
  const response = await fetch(`https://api.simplehash.com/api/v0/nfts/owners?chains=${chain.name}&wallet_addresses=${address}`, {
    headers: JSON_HEADERS,
  });
  const data = await response.json();
  return data;
};
