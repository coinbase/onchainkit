import { sendRequest } from "../../network/request";
import type { HydrateChargeAPIResponse } from "../types";
import { getPayErrorCode } from "./getPayErrorCode";

type HydrateChargeParams = {
  sender: `0x{string}`;
  chargeId: string;
};

type HydrateChargeAPIParams = {
  sender: `0x{string}`;
  chainId: number;
  chargeId: string;
};

const HYDRATE_CHARGE_METHOD_NAME = "pay_hydrateCharge";

export async function hydrateCharge({ sender, chargeId }: HydrateChargeParams) {
  try {
    const res = await sendRequest<
      HydrateChargeAPIParams,
      HydrateChargeAPIResponse
    >(HYDRATE_CHARGE_METHOD_NAME, [
      {
        sender: sender,
        chainId: 8453,
        chargeId,
      },
    ]);
    if (res.error) {
      return {
        code: getPayErrorCode(res.error?.code),
        error: res.error.message,
        message: "",
      };
    }
    return res.result;
  } catch (_error) {
    return {
      code: getPayErrorCode(),
      error: "Something went wrong",
      message: "",
    };
  }
}
