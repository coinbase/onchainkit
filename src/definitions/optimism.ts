import { optimism } from 'viem/chains';
import { EASChainDefinition } from '../core/types';

// More details in https://docs.optimism.io/chain/identity/schemas
export const easChainOptimism: EASChainDefinition = {
  id: optimism.id,
  easGraphqlAPI: 'https://optimism.easscan.org/graphql',
  schemaUids: [
    // N_A
    // https://optimism.easscan.org/schema/view/0xac4c92fc5c7babed88f78a917cdbcdc1c496a8f4ab2d5b2ec29402736b2cf929
    '0xac4c92fc5c7babed88f78a917cdbcdc1c496a8f4ab2d5b2ec29402736b2cf929',
    // GITCOIN_PASSPORT_SCORES_V1:
    // https://optimism.easscan.org/schema/view/0x6ab5d34260fca0cfcf0e76e96d439cace6aa7c3c019d7c4580ed52c6845e9c89
    '0x6ab5d34260fca0cfcf0e76e96d439cace6aa7c3c019d7c4580ed52c6845e9c89',
    // OPTIMISM_GOVERNANCE_SEASON_4_CO_GRANT_PARTICIPANT:
    // https://optimism.easscan.org/schema/view/0x401a80196f3805c57b00482ae2b575a9f270562b6b6de7711af9837f08fa0faf
    '0x401a80196f3805c57b00482ae2b575a9f270562b6b6de7711af9837f08fa0faf',
  ],
  attesterAddresses: [
    // https://optimism.easscan.org/address/0x38e9ef91f1a96aca71e2c5f7abfea45536b995a2
    '0x38e9ef91f1a96aca71e2c5f7abfea45536b995a2',
    // https://optimism.easscan.org/address/0x2a0eb7cae52b68e94ff6ab0bfcf0df8eeeb624be
    '0x2a0eb7cae52b68e94ff6ab0bfcf0df8eeeb624be',
    // https://optimism.easscan.org/address/0x2d93c2f74b2c4697f9ea85d0450148aa45d4d5a2
    '0x2d93c2f74b2c4697f9ea85d0450148aa45d4d5a2',
    // https://optimism.easscan.org/address/0x843829986e895facd330486a61Ebee9E1f1adB1a
    '0x843829986e895facd330486a61Ebee9E1f1adB1a',
    // https://optimism.easscan.org/address/0x3C7820f2874b665AC7471f84f5cbd6E12871F4cC
    '0x3C7820f2874b665AC7471f84f5cbd6E12871F4cC',
  ],
};
