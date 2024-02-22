import { baseSepolia } from 'viem/chains';
import { EASChainDefinition } from '../identity/types';

export const easChainBaseSepolia: EASChainDefinition = {
  id: baseSepolia.id,
  easGraphqlAPI: 'https://base-sepolia.easscan.org/graphql',
  schemaUids: [
    // VERIFIED_COUNTRY
    // https://base-sepolia.easscan.org/schema/view/0xef54ae90f47a187acc050ce631c55584fd4273c0ca9456ab21750921c3a84028
    '0xef54ae90f47a187acc050ce631c55584fd4273c0ca9456ab21750921c3a84028',
    // VERIFIED_ACCOUNT
    // https://base-sepolia.easscan.org/schema/view/0x2f34a2ffe5f87b2f45fbc7c784896b768d77261e2f24f77341ae43751c765a69
    '0x2f34a2ffe5f87b2f45fbc7c784896b768d77261e2f24f77341ae43751c765a69',
  ],
};
