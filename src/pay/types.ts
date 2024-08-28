export type HydrateChargeAPIResponse = {
  id: string;
  callData: {
    deadline: string;
    feeAmount: string;
    id: string;
    operator: `0x${string}`;
    prefix: `0x${string}`;
    recipient: `0x${string}`;
    recipientAmount: string;
    recipientCurrency: `0x${string}`;
    refundDestination: `0x${string}`;
    signature: `0x${string}`;
  };
  metaData: {
    chainId: number;
    contractAddress: `0x${string}`;
    sender: `0x${string}`;
    settlementCurrencyAddress: `0x${string}`;
  };
};
