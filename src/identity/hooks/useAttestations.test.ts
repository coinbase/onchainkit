import { getAttestations } from '@/identity/utils/getAttestations';
/**
 * @vitest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react';
import { base } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAttestations } from './useAttestations';

vi.mock('@/identity/utils/getAttestations', () => ({
  getAttestations: vi.fn(),
}));

describe('useAttestations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns an empty array if no schemaId provided', async () => {
    const address = '0xaddress';
    const chain = base;
    const schemaId = null;
    const { result } = renderHook(() =>
      useAttestations({ address, chain, schemaId }),
    );
    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });

  it('returns an empty array if no attestations found', async () => {
    (getAttestations as Mock).mockReturnValue([]);

    const address = '0xaddress';
    const chain = base;
    const schemaId = '0xschema';
    const { result } = renderHook(() =>
      useAttestations({ address, chain, schemaId }),
    );

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });

  it('returns attestations if found', async () => {
    (getAttestations as Mock).mockReturnValue([
      {
        schemaId: '0xschema',
      },
    ]);

    const address = '0xaddress';
    const chain = base;
    const schemaId = '0xschema';
    const { result } = renderHook(() =>
      useAttestations({ address, chain, schemaId }),
    );

    await waitFor(() => {
      expect(result.current).toEqual([{ schemaId: '0xschema' }]);
    });
  });
});
