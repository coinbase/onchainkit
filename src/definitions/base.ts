import { base } from 'viem/chains';
import { EASChainDefinition } from '../identity/types';

export const easChainBase: EASChainDefinition = {
  id: base.id,
  easGraphqlAPI: 'https://base.easscan.org/graphql',
  schemaUids: [
    // VERIFIED_COUNTRY
    // https://base.easscan.org/schema/view/0x1801901fabd0e6189356b4fb52bb0ab855276d84f7ec140839fbd1f6801ca065
    '0x1801901fabd0e6189356b4fb52bb0ab855276d84f7ec140839fbd1f6801ca065',
    // VERIFIED_ACCOUNT
    // https://base.easscan.org/schema/view/0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9
    '0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9',
  ],
};
