import type { Address } from 'viem';
import { base } from 'viem/chains';

const QUERY = `query($address: String!) {
    vaultByAddress(address: $address, chainId: ${base.id} ) {
        address
        symbol
        name
        creationBlockNumber
        creationTimestamp
        creatorAddress
        whitelisted
        asset {
          id
          address
          decimals
          symbol
        }
        chain {
          id
          network
        }
        liquidity {
          underlying
        }
        state {
          id
          apy
          netApy
          netApyWithoutRewards
          totalAssets
          totalAssetsUsd
          fee
          timelock
          rewards {
            amountPerSuppliedToken
            supplyApr
            yearlySupplyTokens
            asset {
              address
              name
              decimals
            }
        }
      }
    }
  }`;

export type MorphoVaultApiResponse = {
  data: {
    vaultByAddress: {
      address: Address;
      symbol: string;
      name: string;
      creationBlockNumber: number;
      creationTimestamp: number;
      creatorAddress: string;
      whitelisted: boolean;
      asset: {
        id: string;
        address: Address;
        decimals: number;
        symbol: string;
      };
      chain: {
        id: number;
        network: string;
      };
      state: {
        id: string;
        apy: number;
        netApy: number;
        netApyWithoutRewards: number;
        totalAssets: number;
        totalAssetsUsd: number;
        fee: number;
        timelock: number;
        rewards: Array<{
          amountPerSuppliedToken: string;
          supplyApr: number;
          yearlySupplyTokens: string;
          asset: {
            address: Address;
            name: string;
            decimals: number;
          };
        }>;
      };
      liquidity: {
        underlying: string;
      };
    };
  };
  errors: Array<{
    message: string;
    status: string;
  }> | null;
};

export async function fetchMorphoApy(vaultAddress: string) {
  const response = await fetch('https://blue-api.morpho.org/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { address: vaultAddress },
    }),
  });
  const { data, errors } = (await response.json()) as MorphoVaultApiResponse;

  if (errors?.some((err) => err.status === 'BAD_USER_INPUT')) {
    throw new Error(
      'Vault not found. Ensure the address is a valid Morpho vault on Base.',
    );
  }

  if (errors && errors?.length > 0) {
    throw new Error(
      'Error fetching Morpho vault data. Please try again later.',
    );
  }

  return data.vaultByAddress;
}
