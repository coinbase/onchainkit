import { useQuery, type UseQueryResult } from "@tanstack/react-query";

type MintTokenParams = {
  bypassSimulation: boolean;
  loadTest: boolean;
  mintAddress: string;
  network: string;
  quantity: string;
  takerAddress: string;
  tokenId?: string;
};

type UseMintToken = {
  mintAddress: string;
  takerAddress: string;
  tokenId?: string;
}

export type GetMintTokenResponse = {
  callData: {
    data: `0x${string}`;
    from: `0x${string}`;
    to: `0x${string}`;
    value: string;
  };
};

type UseQueryOptions = {
  enabled?: boolean;
  cacheTime?: number;
};


export function useMintToken({
  mintAddress,
  takerAddress,
  tokenId
}: UseMintToken, queryOptions?: UseQueryOptions): UseQueryResult<GetMintTokenResponse> {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const actionKey = `useMintToken-${mintAddress}-${tokenId}`;
  return useQuery({
    queryKey: ['useTokenDetails', actionKey],
    queryFn: async () => {
      return getMintToken(mintAddress, takerAddress, tokenId);
    },
    gcTime: cacheTime,
    enabled: enabled && Boolean(mintAddress && takerAddress),
    refetchOnWindowFocus: false,
  });
}


export async function getMintToken(
  mintAddress: string,
  takerAddress: string,
  tokenId?: string,
): Promise<GetMintTokenResponse | null> {
  if (!mintAddress || !takerAddress) {
    return null;
  }

  const payload: MintTokenParams = {
    bypassSimulation: true,
    loadTest: false,
    mintAddress,
    network: 'networks/base-mainnet',
    quantity: '1',
    takerAddress,
  };

  // TokenId is omitted for ERC-721, but required for ERC-1155
  if (tokenId !== 'undefined' && tokenId !== undefined) {
    payload.tokenId = tokenId;
  }

  const url = new URL('https://api.wallet.coinbase.com/rpc/v3/creators/mintToken');
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
});

  const data = await response.json();
  return data;
}  


// export function useMintToken({mintAddress, tokenId}: UseMintToken) {
//   const { address } = useAccount();

//   const API_URL = 'https://api.wallet.coinbase.com/rpc/v3/creators/mintToken';

//   const payload: Payload = address ? {
//     bypassSimulation: true,
//     loadTest: false,
//     mintAddress,
//     network: 'networks/base-mainnet',
//     quantity: '1',
//     takerAddress: address,
//   } : null;

//   // TokenId is omitted for ERC-721, but required for ERC-1155
//   if (tokenId !== 'undefined' && tokenId !== undefined) {
//     if (payload) {
//       payload.tokenId = tokenId;
//     }
//   }

//   useEffect(() => {
//     async function mintToken() {
//       let response;

//       try {
//         response = await fetch(API_URL, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload),
//         });
//         const data = await response.json();
//         console.log('data', data);
//       } catch (error) {
//         console.error('Error minting token:', error);
//         return;
//       }
//     }

//     if (address) {
//       mintToken();
//     }
//   })


