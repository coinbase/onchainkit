/**
 * @jest-environment jsdom
 */

import { base } from 'viem/chains';
import { getChainPublicClient } from './getChainPublicClient';

describe('getChainPublicClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a public client matching the given chain', async () => {
    const publicClient = getChainPublicClient(base);
    expect(publicClient.chain.id).toBe(base.id);
  });
});
