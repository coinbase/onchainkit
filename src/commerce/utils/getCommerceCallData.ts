import { encodeFunctionData, erc20Abi, parseUnits } from "viem";
import { base } from "viem/chains";
import { Web3Charge } from "../../network/commerce/types/Web3Charge";
import { contractAbi } from "./TransfersContractAbi";

const USDC_DECIMALS = 6;

export function getCommerceCallData(charge: Web3Charge) {
  const {
    web3_data: {
      contract_addresses,
      transfer_intent: {
        call_data: {
          deadline,
          recipient_amount,
          recipient,
          recipient_currency,
          fee_amount,
          refund_destination,
          operator,
          signature,
          prefix,
          id,
        },
      },
    },
  } = charge;
  return {
    tokenApprovalCall: {
      to: recipient_currency,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [
          contract_addresses[base.id],
          parseUnits(charge.pricing.settlement.amount, USDC_DECIMALS),
        ],
      }),
    },
    transferTokenPreApprovedCall: {
      to: contract_addresses["8453"],
      data: encodeFunctionData({
        abi: contractAbi,
        functionName: "transferTokenPreApproved",
        args: [
          {
            id,
            recipientAmount: BigInt(recipient_amount),
            deadline: BigInt(Math.floor(new Date(deadline).getTime() / 1000)),
            recipient,
            recipientCurrency: recipient_currency,
            refundDestination: refund_destination,
            feeAmount: BigInt(fee_amount),
            operator,
            signature,
            prefix,
          },
        ],
      }),
    },
  };
}
