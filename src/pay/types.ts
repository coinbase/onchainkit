import type { Address } from 'viem';

export type HydratedCharge = {
  id: string;
  callData: {
    deadline: string;
    feeAmount: string;
    id: string;
    operator: Address;
    prefix: Address;
    recipient: Address;
    recipientAmount: string;
    recipientCurrency: Address;
    refundDestination: Address;
    signature: Address;
  };
  metaData: {
    chainId: number;
    contractAddress: Address;
    sender: Address;
    settlementCurrencyAddress: Address;
  };
};
