import { useCallback } from "react";
import { Config } from "wagmi";
import { hydrateAndPayCharge } from "../utils/hydrateAndPayCharge";

export type PayChargeParams = {
  chargeId: string;
  wagmiConfig: Config;
  commerceUrl: string;
};

export function usePayCharge() {
  const payCharge = useCallback(
    async ({ chargeId, wagmiConfig, commerceUrl }: PayChargeParams) => {
      try {
        return hydrateAndPayCharge({
          chargeId,
          wagmiConfig,
          commerceUrl,
        });
      } catch (err) {
        throw err;
      }
    },
    []
  );
  return { payCharge };
}
