/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { base } from 'viem/chains';
import { useAttestations } from './useAttestations';
import { getEASAttestations } from '../getEASAttestations';

jest.mock('../getEASAttestations', () => ({
  getEASAttestations: jest.fn(),
}));

describe('useAttestations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null if no attestations found', async () => {
    (getEASAttestations as jest.Mock).mockReturnValue([
      {
        schemaId: '0xdiffSchema',
      },
    ]);

    const address = '0xaddress';
    const chain = base;
    const schemaId = '0xschema';
    const { result } = renderHook(() => useAttestations({ address, chain, schemaId }));

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });
});
