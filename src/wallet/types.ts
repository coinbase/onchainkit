import { isValidAAEntrypoint } from './isValidAAEntrypoint';
/**
 * Note: exported as public Type
 */
export type ConnectAccountReact = {
  children?: React.ReactNode; // Children can be utilized to display customized content when the wallet is connected.
};

export type isValidAAEntrypointOptions = {
  entrypoint: string;
};

export type isValidAAEntrypointResponse = boolean;
