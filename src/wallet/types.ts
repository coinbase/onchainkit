import { isEntrypoint } from './isEntrypoint';
/**
 * Note: exported as public Type
 */
export type ConnectAccountReact = {
  children?: React.ReactNode; // Children can be utilized to display customized content when the wallet is connected.
};

export type isEntrypointOptions = {
  entrypoint: string;
};

export type isEntrypointResponse = boolean;
