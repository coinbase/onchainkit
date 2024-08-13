export type Web3Charge = {
  charge_kind: Web3ChargeChargeKind;
  checkout?: Web3ChargeCheckout;
  code: string;
  description?: string;
  expires_at: string;
  hosted_url: string;
  id: string;
  metadata?: Web3ChargeMetadata;
  name?: string;
  organization_name?: string;
  pricing: Web3ChargePricing;
  pricing_type: Web3ChargePricingType;
  pwcb_only?: boolean;
  redirects?: Web3ChargeRedirects;
  support_email: string;
  third_party_provider?: string;
  timeline: Web3ChargeTimelineItem[];
  web3_data: Web3ChargeWeb3Data;
};

export type Web3ChargeWeb3DataSubsidizedPaymentsChainToTokens = {
  [key: string]: any;
};

export type Web3ChargeWeb3DataSettlementCurrencyAddresses = {
  [key: string]: string;
};

export type Web3ChargeWeb3DataContractAddresses = { [key: string]: `0x${string}` };

export type Web3ChargeWeb3Data = {
  failure_events: Web3ChargeWeb3DataFailureEventsItem[];
  success_events: Web3ChargeWeb3DataSuccessEventsItem[];
  transfer_intent: Web3ChargeWeb3DataTransferIntent;
  contract_addresses: Web3ChargeWeb3DataContractAddresses;
  settlement_currency_addresses?: Web3ChargeWeb3DataSettlementCurrencyAddresses;
};

export type Web3ChargeWeb3DataTransferIntentMetadata = {
  chain_id: number;
  /** @deprecated */
  contract_address: string;
  sender: string;
};

export type Web3ChargeWeb3DataTransferIntentCallData = {
  deadline: string;
  fee_amount: string;
  id: `0x${string}`;
  operator: `0x${string}`;
  prefix: `0x${string}`;
  recipient: `0x${string}`;
  recipient_amount: string;
  recipient_currency: `0x${string}`;
  refund_destination: `0x${string}`;
  signature: `0x${string}`;
};

export type Web3ChargeWeb3DataTransferIntent = {
  call_data: Web3ChargeWeb3DataTransferIntentCallData;
  metadata: Web3ChargeWeb3DataTransferIntentMetadata;
};

export type Web3ChargeWeb3DataSuccessEventsItem = {
  chain_id: number;
  finalized: boolean;
  input_token_address: string;
  input_token_amount: string;
  network_fee_paid: string;
  network_fee_paid_local?: string;
  recipient: string;
  sender: string;
  timestamp: string;
  tx_hsh: string;
};

export type Web3ChargeWeb3DataFailureEventsItem = {
  chain_id?: number;
  input_token_address?: string;
  network_fee_paid?: string;
  reason?: string;
  sender?: string;
  timestamp?: string;
  tx_hsh?: string;
};

export type Web3ChargeTimelineItemStatus =
  (typeof Web3ChargeTimelineItemStatus)[keyof typeof Web3ChargeTimelineItemStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Web3ChargeTimelineItemStatus = {
  COMPLETED: "COMPLETED",
  EXPIRED: "EXPIRED",
  FAILED: "FAILED",
  NEW: "NEW",
  PENDING: "PENDING",
  SIGNED: "SIGNED",
  CANCELED: "CANCELED",
} as const;

export type Web3ChargeTimelineItem = {
  status: Web3ChargeTimelineItemStatus;
  time: string;
};

export type Web3ChargeRedirects = {
  cancel_url?: string;
  success_url?: string;
  will_redirect_after_success?: boolean;
};

export type Web3ChargePricingType =
  (typeof Web3ChargePricingType)[keyof typeof Web3ChargePricingType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Web3ChargePricingType = {
  fixed_price: "fixed_price",
  no_price: "no_price",
} as const;

export type Web3ChargePricing = {
  local: Currency;
  settlement: Currency;
};

export type Web3ChargeMetadata = { [key: string]: string };

export type Web3ChargeCheckout = {
  id?: string;
};

export type Web3ChargeChargeKind =
  (typeof Web3ChargeChargeKind)[keyof typeof Web3ChargeChargeKind];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Web3ChargeChargeKind = {
  WEB3: "WEB3",
} as const;

export type Currency = {
  amount: string;
  currency: string;
};
