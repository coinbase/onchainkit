import { Config } from "wagmi";
import { connect } from "wagmi/actions";
import { base } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";
import { hydrateCommerceCharge } from "../../network/commerce/hydrateCommereCharge";
import { getCommerceCallData } from "./getCommerceCallData";
import { sendCalls } from "@wagmi/core/experimental";

export type HydrateAndPayChargeProps = {
    chargeId: string;
    wagmiConfig: Config;
    commerceUrl: string;
}

const SMART_WALLET_CONNECTOR = coinbaseWallet({
    preference: 'smartWalletOnly',
  });

export async function hydrateAndPayCharge({ chargeId, wagmiConfig, commerceUrl }: HydrateAndPayChargeProps): Promise<{ paymentCallsId: string }> {
    const { accounts } = await connect(wagmiConfig, {
        connector: SMART_WALLET_CONNECTOR,
        chainId: base.id,
      });
      const senderAddress = accounts[0];
      if (!senderAddress) {
        throw new Error('fff');
      }
      const { data: hydratedCharge } = await hydrateCommerceCharge(
        commerceUrl,
        chargeId,
        senderAddress,
      );
      const { tokenApprovalCall, transferTokenPreApprovedCall } =
        getCommerceCallData(hydratedCharge);
  
      const callsId = await sendCalls(wagmiConfig, {
        calls: [tokenApprovalCall, transferTokenPreApprovedCall],
      });

      return { paymentCallsId: callsId }
}