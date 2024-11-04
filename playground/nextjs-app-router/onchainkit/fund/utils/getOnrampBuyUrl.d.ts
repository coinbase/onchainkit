import type { GetOnrampUrlWithProjectIdParams, GetOnrampUrlWithSessionTokenParams } from '../types';
/**
 * Builds a Coinbase Onramp buy URL using the provided parameters.
 * @param projectId a projectId generated in the Coinbase Developer Portal
 * @returns the URL
 */
export declare function getOnrampBuyUrl({ projectId, ...props }: GetOnrampUrlWithProjectIdParams | GetOnrampUrlWithSessionTokenParams): string;
//# sourceMappingURL=getOnrampBuyUrl.d.ts.map