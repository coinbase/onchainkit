import type { ReactNode } from 'react';

/**
 * Props used to get an Onramp buy URL by directly providing a CDP project ID.
 * See https://docs.cdp.coinbase.com/onramp/docs/api-initializing#generating-the-coinbase-onramp-buysell-url
 *
 * Note: exported as public Type
 */
export type GetOnrampUrlWithProjectIdParams = {
  /**
   * The Project ID of your CDP project created at https://portal.cdp.coinbase.com/
   * This must be provided if you don't provide a sessionToken.
   */
  projectId: string;
  sessionToken?: never;
  /**
   * The addresses that the customer's funds should be delivered to.
   *
   * Each entry in the record represents a wallet address and the networks it is valid for. There should only be a
   * single address for each network your app supports. Users will be able to buy/send any asset supported by any of
   * the networks you specify. See the assets param if you want to restrict the available assets.
   *
   * Some common examples:
   *
   * Support all assets that are available for sending on the base network, only on the base network:
   *
   * `{ "0x1": ["base"] }`
   */
  addresses: Record<string, string[]>;
  /**
   * This optional parameter will restrict the assets available for the user to buy/send. It acts as a filter on the
   * networks specified in the {addresses} param.
   *
   * Some common examples:
   *
   * Support only USDC on either the base network or the ethereum network:
   *
   * `addresses: { "0x1": ["base", "ethereum"] }, assets: ["USDC"]`
   *
   * The values in this list can either be asset symbols like BTC, ETH, or asset UUIDs that you can get from the Buy
   * Options API {@link https://docs.cdp.coinbase.com/onramp/docs/api-configurations/#buy-options}.
   */
  assets?: string[];
} & GetOnrampBuyUrlOptionalProps;

/**
 * Props used to get an Onramp buy URL using a session token created using the Onramp session token API.
 * See https://docs.cdp.coinbase.com/onramp/docs/api-initializing#getting-an-coinbase-onramp-buysell-session-token
 *
 * Note: exported as public Type
 */
export type GetOnrampUrlWithSessionTokenParams = {
  /**
   * A session token create using the Onramp session token API. The token will be linked to the project ID, addresses,
   * and assets params provided in the create session token API request.
   */
  sessionToken: string;
  projectId?: never;
  addresses?: never;
  assets?: never;
} & GetOnrampBuyUrlOptionalProps;

/**
 * The optional properties that can be used to create an Onramp buy URL.
 */
type GetOnrampBuyUrlOptionalProps = {
  /**
   * If specified, this asset will be automatically selected for the user in the Onramp UI. Should be a valid asset
   * symbol e.g. BTC, ETH, USDC.
   */
  defaultAsset?: string;
  /**
   * If specified, this network will be automatically selected for the user in the Onramp UI. Should be a valid network
   * name in lower case e.g. ethereum, base.
   */
  defaultNetwork?: string;
  /**
   * A unique identifier that will be associated with any transactions created by the user during their Onramp session.
   * You can use this with the Transaction Status API to check the status of the user's transaction.
   * See https://docs.cdp.coinbase.com/onramp/docs/api-reporting#buy-transaction-status
   */
  partnerUserId?: string;
  /**
   * This amount will be used to pre-fill the amount of crypto the user is buying or sending. The user can choose to
   * change this amount in the UI. Only one of presetCryptoAmount or presetFiatAmount should be provided.
   */
  presetCryptoAmount?: number;
  /**
   * This amount will be used to pre-fill the fiat value of the crypto the user is buying or sending. The user can
   * choose to change this amount in the UI. Only one of presetCryptoAmount or presetFiatAmount should be provided.
   */
  presetFiatAmount?: number;

  /**
   * The default payment method that will be selected for the user in the Onramp UI. Should be one of the payment methods
   */
  defaultPaymentMethod?: string;
  /**
   * The currency code of the fiat amount provided in the presetFiatAmount param e.g. USD, CAD, EUR.
   */
  fiatCurrency?: string;
  /**
   * A URL that the user will be automatically redirected to after a successful buy/send. The domain must match a domain
   * on the domain allowlist in Coinbase Developer Platform (https://portal.cdp.coinbase.com/products/onramp).
   */
  redirectUrl?: string;

  /**
   * The name of the component that is calling the Onramp buy URL. This will be used for analytics.
   */
  originComponentName?: string;
};

/**
 * Note: exported as public Type
 */
export type FundButtonReact = {
  className?: string; // An optional CSS class name for styling the button component
  disabled?: boolean; // A optional prop to disable the fund button
  text?: string; // An optional text to be displayed in the button component
  successText?: string; // An optional text to be displayed in the button component when the transaction is successful
  errorText?: string; // An optional text to be displayed in the button component when the transaction fails
  state?: FundButtonStateReact; // The state of the button component
  hideText?: boolean; // An optional prop to hide the text in the button component
  hideIcon?: boolean; // An optional prop to hide the icon in the button component
  fundingUrl?: string; // An optional prop to provide a custom funding URL
  openIn?: 'popup' | 'tab'; // Whether to open the funding flow in a tab or a popup window
  /**
   * Note: popupSize will be ignored when using a Coinbase Onramp URL (i.e. https://pay.coinbase.com/*) as it requires
   * a fixed popup size.
   */
  popupSize?: 'sm' | 'md' | 'lg'; // Size of the popup window if `openIn` is set to `popup`
  rel?: string; // Specifies the relationship between the current document and the linked document
  target?: string; // Where to open the target if `openIn` is set to tab
  fiatCurrency?: string; // The currency code of the fiat amount provided in the presetFiatAmount param e.g. USD, CAD, EUR.
  onPopupClose?: () => void; // A callback function that will be called when the popup window is closed
  onClick?: () => void; // A callback function that will be called when the button is clicked
};

export type FundButtonStateReact = 'default' | 'success' | 'error' | 'loading';

/**
 * Matches a JSON object.
 * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. Don't use this as a direct return type as the user would have to double-cast it: `jsonObject as unknown as CustomResponse`. Instead, you could extend your CustomResponse type from it to ensure your type only uses JSON-compatible types: `interface CustomResponse extends JsonObject { … }`.
 * @category JSON
 */
export type JsonObject = { [Key in string]?: JsonValue };

/**
 * Matches a JSON array.
 * @category JSON
 */
export type JsonArray = JsonValue[];

/**
 * Matches any valid JSON primitive value.
 * @category JSON
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * Matches any valid JSON value.
 * @see `Jsonify` if you need to transform a type to one that is assignable to `JsonValue`.
 * @category JSON
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export type OpenEvent = {
  eventName: 'open';
  widgetName: string;
};

export type TransitionViewEvent = {
  eventName: 'transition_view';
  pageRoute: string;
};

export type PublicErrorEvent = {
  eventName: 'error';
  error: OnrampError;
};

export type ExitEvent = {
  eventName: 'exit';
  error?: OnrampError;
};

export type SuccessEvent = {
  eventName: 'success';
  data?: SuccessEventData;
};

/**
 * Note: exported as public Type
 */
export type SuccessEventData = {
  assetImageUrl: string;
  assetName: string;
  assetSymbol: string;
  chainId: string;
};

export type RequestOpenUrlEvent = {
  eventName: 'request_open_url';
  url: string;
};

/**
 * Note: exported as public Type
 */
export type EventMetadata =
  | OpenEvent
  | TransitionViewEvent
  | PublicErrorEvent
  | ExitEvent
  | SuccessEvent
  | RequestOpenUrlEvent;

/**
 * Note: exported as public Type
 */
export type OnrampError = {
  errorType:
    | 'internal_error'
    | 'handled_error'
    | 'network_error'
    | 'unknown_error';
  code?: string;
  debugMessage?: string;
};

/**
 * Note: exported as public Type
 */
export type OnrampTransactionStatusName =
  | 'ONRAMP_TRANSACTION_STATUS_UNSPECIFIED'
  | 'ONRAMP_TRANSACTION_STATUS_CREATED'
  | 'ONRAMP_TRANSACTION_STATUS_IN_PROGRESS'
  | 'ONRAMP_TRANSACTION_STATUS_SUCCESS'
  | 'ONRAMP_TRANSACTION_STATUS_FAILED';

/**
 * Note: exported as public Type
 */
export type OnrampAmount = {
  value: string;
  currency: string;
};

export type OnrampTransaction = {
  status: OnrampTransactionStatusName;
  purchaseCurrency: string;
  purchaseNetwork: string;
  purchaseAmount: OnrampAmount;
  paymentTotal: OnrampAmount;
  paymentSubtotal: OnrampAmount;
  coinbaseFee: OnrampAmount;
  networkFee: OnrampAmount;
  exchangeRate: OnrampAmount;
  txHash: string;
  createdAt: string;
  country: string;
  userId: string;
  paymentMethod: string;
  transactionId: string;
};

/**
 * Note: exported as public Type
 */
export type OnrampPaymentMethod = {
  id: string;
};

/**
 * Note: exported as public Type
 */
export type OnrampPaymentMethodLimit = {
  id: string;
  min: string;
  max: string;
};

type OnrampNetwork = {
  name: string;
  displayName: string;
  chainId: string;
  contractAddress: string;
};

/**
 * Note: exported as public Type
 */
export type OnrampOptionsResponseData = {
  /**
   * List of supported fiat currencies that can be exchanged for crypto on Onramp in the given location.
   * Each currency contains a list of available payment methods, with min and max transaction limits for that currency.
   */
  paymentCurrencies: OnrampPaymentCurrency[];
  /**
   * List of available crypto assets that can be bought on Onramp in the given location.
   */
  purchaseCurrencies: OnrampPurchaseCurrency[];
};

/**
 * Note: exported as public Type
 */
export type OnrampPurchaseCurrency = {
  id: string;
  name: string;
  symbol: string;
  iconUrl: string;
  networks: OnrampNetwork[];
};

export type OnrampPaymentCurrency = {
  id: string;
  limits: OnrampPaymentMethodLimit[];
  iconUrl: string;
};

export type FundCardAmountInputPropsReact = {
  className?: string;
};

export type FundCardAmountInputTypeSwitchPropsReact = {
  className?: string;
};

export type FundCardHeaderPropsReact = {
  className?: string;
};

export type FundCardPaymentMethodImagePropsReact = {
  className?: string;
  size?: number;
  paymentMethod: PaymentMethod;
};

export type PaymentMethod = {
  id: string;
  name: string;
  description: string;
  icon: string;
  minAmount?: number;
  maxAmount?: number;
};

export type FundCardPaymentMethodDropdownPropsReact = {
  className?: string;
};

export type FundCardCurrencyLabelPropsReact = {
  label: string;
};

/**
 * Note: exported as public Type
 */
export type FundCardPropsReact = {
  children?: ReactNode;
  assetSymbol: string;
  placeholder?: string | React.ReactNode;
  headerText?: string;
  buttonText?: string;
  country: string;
  subdivision?: string;
  currency?: string;
  className?: string;
  presetAmountInputs?: PresetAmountInputs;
} & LifecycleEvents;

export type FundCardContentPropsReact = {
  children?: ReactNode;
};

export type FundCardPaymentMethodSelectorTogglePropsReact = {
  className?: string;
  isOpen: boolean; // Determines carot icon direction
  onClick: () => void; // Button on click handler
  paymentMethod: PaymentMethod;
};

export type FundCardPaymentMethodSelectRowPropsReact = {
  paymentMethod: PaymentMethod;
  onClick?: (paymentMethod: PaymentMethod) => void;
  hideImage?: boolean;
  hideDescription?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  testId?: string;
};

export type FundCardProviderReact = {
  children: ReactNode;
  asset: string;
  /**
   * Three letter currency code. Defaults to USD.
   */
  currency?: string;
  paymentMethods?: PaymentMethod[];
  headerText?: string;
  buttonText?: string;
  country: string;
  subdivision?: string;
  inputType?: AmountInputType;
  presetAmountInputs?: PresetAmountInputs;
} & LifecycleEvents;

export type LifecycleEvents = {
  onError?: (e: OnrampError | undefined) => void;
  onStatus?: (lifecycleStatus: LifecycleStatus) => void;
  onSuccess?: (result: SuccessEventData) => void;
};

export type AmountInputType = 'fiat' | 'crypto';

export type LifecycleStatus =
  | {
      statusName: 'init';
      statusData: null;
    }
  | {
      statusName: 'exit';
      statusData: null;
    }
  | {
      statusName: 'error';
      statusData: OnrampError;
    }
  | {
      statusName: 'transactionSuccess';
      statusData: SuccessEventData;
    }
  | {
      statusName: 'transactionPending';
      statusData: null;
    };

export type PresetAmountInputItemPropsReact = {
  presetAmountInput: string;
  currency: string;
  onClick: (presetAmountInput: string) => void;
};

/**
 * To use this type, you must provide a tuple of strings with a length of 3.
 *
 * Example:
 *
 * const presetAmountInputs: PresetAmountInputs = ['100', '200', '300'];
 */
export type PresetAmountInputs = readonly [string, string, string];

/**
 * Note: exported as public Type
 */
export type OnrampConfigCountry = {
  id: string;
  subdivisions: string[];
  paymentMethods: OnrampPaymentMethod[];
};

/**
 * Note: exported as public Type
 */
export type OnrampConfigResponseData = {
  countries: OnrampConfigCountry[];
};

/**
 * Note: exported as public Type
 */
export type OnrampQuoteResponseData = {
  /**
   * Object with amount and currency of the total fiat payment required to complete the purchase, inclusive of any fees.
   * The currency will match the `paymentCurrency` in the request if it is supported, otherwise it falls back to USD.
   */
  paymentTotal: OnrampAmount;
  /**
   * Object with amount and currency of the fiat cost of the crypto asset to be purchased, exclusive of any fees.
   * The currency will match the `paymentCurrency`.
   */
  paymentSubtotal: OnrampAmount;
  /**
   * Object with amount and currency of the crypto that to be purchased.
   * The currency will match the `purchaseCurrency` in the request.
   * The number of decimals will be based on the crypto asset.
   */
  purchaseAmount: OnrampAmount;
  /**
   * Object with amount and currency of the fee changed by the Coinbase exchange to complete the transaction.
   * The currency will match the `paymentCurrency`.
   */
  coinbaseFee: OnrampAmount;
  /**
   * Object with amount and currency of the network fee required to send the purchased crypto to the user's wallet.
   * The currency will match the `paymentCurrency`.
   */
  networkFee: OnrampAmount;
  /**
   * Reference to the quote that should be passed into the initialization parameters when launching the Coinbase Onramp widget via the SDK or URL generator.
   */
  quoteId: string;
};
