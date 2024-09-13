/**
 * @vitest-environment jsdom
 */

import { base } from 'viem/chains';
import { getChainPublicClient } from './getChainPublicClient';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('getChainPublicClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a public client matching the given chain', async () => {
    const publicClient = getChainPublicClient(base);
    expect(publicClient.chain.id).toBe(base.id);
  });
});
