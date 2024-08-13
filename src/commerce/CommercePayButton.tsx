import { connect } from "@wagmi/core";
import { getCallsStatus, sendCalls } from "@wagmi/core/experimental";
import { coinbaseWallet } from "wagmi/connectors";
import { smartWalletConfig } from "./smartWalletConfig";
import { hydrateCommerceCharge } from "../network/commerce/hydrateCommereCharge";
import { useEffect, useState } from "react";
import { getCommerceCharge } from "../network/commerce/getCommerceCharge";
import { Web3Charge } from "../network/commerce/types/Web3Charge";
import { base } from "viem/chains";
import { getCommerceCallData } from "./utils/getCommerceCallData";

type CommercePayButtonProps = {
  chargeId: string;
};

const SMART_WALLET_CONNECTOR = coinbaseWallet({
  preference: "smartWalletOnly",
});

const BASE_COMMERCE_URL = "https://api.commerce.coinbase.com";

export function CommercePayButton({ chargeId }: CommercePayButtonProps) {
  const [charge, setCharge] = useState<Web3Charge>();
  const [transactionCallsId, setTransactionCallsId] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  useEffect(() => {
    async function checkCallsStatus() {
      const { status, receipts } = await getCallsStatus(smartWalletConfig, {
        id: transactionCallsId,
      });
      if (status === "CONFIRMED") {
        const transactionHash = receipts?.[0].transactionHash;
        if (transactionHash) {
          setTransactionHash(transactionHash);
        }
      }
    }
    const interval = setInterval(() => {
      if (transactionCallsId && !transactionHash) {
        void checkCallsStatus();
      }
    }, 2000);
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [transactionCallsId]);

  useEffect(() => {
    async function loadCharge() {
      const chargeResponse = await getCommerceCharge(
        BASE_COMMERCE_URL,
        chargeId
      );
      console.log({ chargeResponse });
      setCharge(chargeResponse.data);
    }
    if (!charge) {
      void loadCharge();
    }
  }, [chargeId]);

  const handlePayment = async () => {
    const { accounts } = await connect(smartWalletConfig, {
      connector: SMART_WALLET_CONNECTOR,
      chainId: base.id,
    });
    const senderAddress = accounts[0];
    if (!senderAddress) {
      return;
    }
    const { data: hydratedCharge } = await hydrateCommerceCharge(
      BASE_COMMERCE_URL,
      chargeId,
      senderAddress
    );
    const { tokenApprovalCall, transferTokenPreApprovedCall } =
      getCommerceCallData(hydratedCharge);

    const callsId = await sendCalls(smartWalletConfig, {
      calls: [tokenApprovalCall, transferTokenPreApprovedCall],
    });
    setTransactionCallsId(callsId);
  };
  if (!charge) {
    return <div>Loading...</div>;
  }
  if (!transactionHash && transactionCallsId) {
    return <div>Processing...</div>;
  }
  if (transactionHash) {
    return (
      <div>
        <div>Payment Complete</div>
        <a href={`https://basescan.org/tx/${transactionHash}`}>
          View on Block Explorer
        </a>
      </div>
    );
  }
  return (
    <div>
      <button onClick={() => handlePayment()}>Pay with Crypto</button>
    </div>
  );
}
