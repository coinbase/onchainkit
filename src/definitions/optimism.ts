import { optimism } from 'viem/chains';
import { EASChainDefinition } from '../identity/types';

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
};
