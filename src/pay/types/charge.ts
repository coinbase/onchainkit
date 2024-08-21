export type CommerceCharge = {
  code: string;
  description?: string;
  expires_at: string;
  hosted_url: string;
  id: string;
  name?: string;
  organization_name?: string;
  pricing: Pricing;
  pricing_type: PricingType;
  redirects?: Redirects;
  support_email: string;
  timeline: TimelineItem[];
  web3_data: Web3Data;
};

export type SettlementCurrencyAddresses = {
  [chainId: string]: `0x${string}`;
};

export type ContractAddresses = {
  [chainId: string]: `0x${string}`;
};

export type Web3Data = {
  failure_events: FailureEventsItem[];
  success_events: SuccessEventsItem[];
  transfer_intent: TransferIntent;
  contract_addresses: ContractAddresses;
  settlement_currency_addresses?: SettlementCurrencyAddresses;
};

export type TransferIntentMetadata = {
  chain_id: number;
  sender: string;
};

export type TransferIntentCallData = {
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

export type TransferIntent = {
  call_data: TransferIntentCallData;
  metadata: TransferIntentMetadata;
};

export type SuccessEventsItem = {
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

export type FailureEventsItem = {
  chain_id?: number;
  input_token_address?: string;
  network_fee_paid?: string;
  reason?: string;
  sender?: string;
  timestamp?: string;
  tx_hsh?: string;
};

export type TimelineItemStatus =
  (typeof TimelineItemStatuses)[keyof typeof TimelineItemStatuses];

export const TimelineItemStatuses = {
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
  FAILED: 'FAILED',
  NEW: 'NEW',
  PENDING: 'PENDING',
  SIGNED: 'SIGNED',
  CANCELED: 'CANCELED',
} as const;

export type TimelineItem = {
  status: TimelineItemStatus;
  time: string;
};

export type Redirects = {
  cancel_url?: string;
  success_url?: string;
  will_redirect_after_success?: boolean;
};

export type PricingType = (typeof PricingTypes)[keyof typeof PricingTypes];

export const PricingTypes = {
  fixed_price: 'fixed_price',
  no_price: 'no_price',
} as const;

export type Pricing = {
  local: Currency;
  settlement: Currency;
};

export type Metadata = { [key: string]: string };

export type Currency = {
  amount: string;
  currency: string;
};
