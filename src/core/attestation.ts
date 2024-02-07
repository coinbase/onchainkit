import { base } from 'viem/chains';
import { AttestationSchema } from './types';
import type { Chain } from 'viem';

export const easScanGraphQLAPI = 'https://base.easscan.org/graphql';

const supportedChains: Record<
  number,
  { schemaUids: Record<string, string>; attesterAddresses: string[] }
> = {
  [base.id]: {
    schemaUids: {
      'VERIFIED COUNTRY': '0x1801901fabd0e6189356b4fb52bb0ab855276d84f7ec140839fbd1f6801ca065',
      'VERIFIED ACCOUNT': '0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9',
    },
    attesterAddresses: ['0x357458739F90461b99789350868CD7CF330Dd7EE'],
  },
};

export function isChainSupported(chain: Chain): boolean {
  return !!supportedChains[chain.id];
}

export function getChainSchemasUids(
  schemas: AttestationSchema[],
  clientChainId?: number,
): string[] {
  if (!clientChainId) {
    return [];
  }
  return schemas.map((schema) => supportedChains[clientChainId]['schemaUids'][schema]);
}

export function getAttesterAddresses(chain: Chain): string[] {
  return supportedChains[chain.id].attesterAddresses;
}
