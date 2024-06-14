import { useMemo } from "react";
import type { Token } from "../../token";
import { getRoundedAmount } from "../../utils/getRoundedAmount";
import { formatUnits } from "viem";

type GetTokenBalancesParams = {
  token?: Token;
  ethBalance?: string;
  tokenBalance?: bigint;
};

export function getTokenBalances({
  ethBalance,
  token,
  tokenBalance,
}: GetTokenBalancesParams) {
  return useMemo(() => {
    let convertedBalance, roundedBalance;
    if (token?.symbol === "ETH" && ethBalance) {
      convertedBalance = ethBalance;
      roundedBalance = getRoundedAmount(ethBalance, 8);
    }

    if (token && tokenBalance) {
      convertedBalance = formatUnits(tokenBalance, token?.decimals);
      roundedBalance = getRoundedAmount(convertedBalance, 8);
    }
    return { convertedBalance, roundedBalance };
  }, [ethBalance, token, tokenBalance]);
}
