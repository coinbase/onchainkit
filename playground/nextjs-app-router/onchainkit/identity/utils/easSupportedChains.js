import { easChainBase } from '../../network/definitions/base.js';
import { easChainBaseSepolia } from '../../network/definitions/baseSepolia.js';
import { easChainOptimism } from '../../network/definitions/optimism.js';
const easSupportedChains = {
  [easChainBase.id]: easChainBase,
  [easChainBaseSepolia.id]: easChainBaseSepolia,
  [easChainOptimism.id]: easChainOptimism
};

/**
 * Checks if a given blockchain chain is supported by EAS attestations.
 */
function isChainSupported(chain) {
  return chain.id in easSupportedChains;
}

/**
 * Function to get the EAS GraphQL API endpoint for a given blockchain.
 */
function getChainEASGraphQLAPI(chain) {
  return easSupportedChains[chain.id]?.easGraphqlAPI ?? '';
}
export { easSupportedChains, getChainEASGraphQLAPI, isChainSupported };
//# sourceMappingURL=easSupportedChains.js.map
