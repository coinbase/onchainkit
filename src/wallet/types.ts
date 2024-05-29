/**
 * Note: exported as public Type
 */
export type ConnectAccountReact = {
  children?: React.ReactNode; // Children can be utilized to display customized content when the wallet is connected.
};

export type isBaseOptions = {
  chainId: number;
};

export type isBaseResponse = { isValid: true } | { isValid: false; error: string; code: string };
