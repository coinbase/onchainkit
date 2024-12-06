import type { Address } from 'viem';
import { base } from 'viem/chains';
import { sendRequest } from '../../network/request';
import type { TokenBalanceWithFiatValue } from '../../wallet/components/island/WalletIslandTokenHoldings';
import getTokenFiatValue from './getTokenFiatConversionRates';

type CdpListBalancesResponse = {
  id: number;
  jsonrpc: string;
  result: {
    balances: CdpListBalanceTokenData[];
    nextPageToken: string;
  };
};

type CdpListBalanceTokenData = {
  asset: {
    id: string;
    groupId: `0x${string}` | Address;
    subGroupId: `0x${string}` | Address;
    type: string;
  };
  decimals: number;
  value: number;
  valueStr: string;
};

export default async function getAddressTokenBalances(
  address: `0x${string}`,
): Promise<TokenBalanceWithFiatValue[]> {
  if (!address || typeof address !== 'string') {
    throw new Error('Invalid address');
  }

  const walletTokenBalances: TokenBalanceWithFiatValue[] = [];
  let pageToken = '';
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  do {
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        const requestParams = {
          address,
          pageToken: pageToken,
          pageSize: 100,
        };

        const response = (await sendRequest('cdp_listBalances', [
          requestParams,
        ])) as CdpListBalancesResponse;

        console.log({ response });

        for (const token of response.result.balances) {
          if (token.asset.type === 'erc20' || token.asset.type === 'native') {
            const fiatConversionRate = await getTokenFiatValue(
              'ETH', // TODO [BOE-890]: get the token symbol from the token
              'USD', // TODO [BOE-892]: get the user's desired fiat currency
            );

            const fiatValue =
              (token.value * fiatConversionRate) / 10 ** token.decimals; // TODO use promise.all here
            const walletTokenBalance: TokenBalanceWithFiatValue = {
              token: {
                address: token.asset.groupId,
                chainId: base.id,
                decimals: token.decimals,
                image: null,
                name: '',
                symbol: '',
              },
              balance: token.value / 10 ** token.decimals,
              valueInFiat: fiatValue,
            };
            walletTokenBalances.push(walletTokenBalance);
          }
        }

        pageToken = response.result.nextPageToken;
        break;
      } catch (error) {
        retries++;
        console.error(`Error fetching token balances: ${error}`);

        if (retries === MAX_RETRIES) {
          throw new Error(
            `Failed to fetch token balances after ${MAX_RETRIES} retries. Error: ${error}`,
          );
        }

        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  } while (pageToken);

  return walletTokenBalances.sort((a, b) => b.valueInFiat - a.valueInFiat);
}
