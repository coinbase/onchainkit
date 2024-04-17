/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { base } from 'viem/chains';
import { useAttestation } from './useAttestation';

import { useOnchainKit } from '../../useOnchainKit';
import { getEASAttestations } from '../getEASAttestations';

jest.mock('../../useOnchainKit', () => ({
  useOnchainKit: jest.fn(),
}));

jest.mock('../getEASAttestations', () => ({
  getEASAttestations: jest.fn(),
}));

describe('useAttestation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null if no attestations found', async () => {
    (useOnchainKit as jest.Mock).mockReturnValue({
      identity: {
        eas: {
          chain: base,
          schemaId: '0xschema',
        },
      },
    });

    (getEASAttestations as jest.Mock).mockReturnValue([
      {
        schemaId: '0xdiffSchema',
      },
    ]);

    const address = '0xaddress';
    const { result } = renderHook(() => useAttestation(address));

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it('returns eas if eas attestations found', async () => {
    (useOnchainKit as jest.Mock).mockReturnValue({
      identity: {
        eas: {
          chain: base,
          schemaId: '0xschema',
        },
      },
    });

    (getEASAttestations as jest.Mock).mockReturnValue([
      {
        schemaId: '0xschema',
      },
    ]);

    const address = '0xaddress';
    const { result } = renderHook(() => useAttestation(address));

    await waitFor(() => {
      expect(result.current).toBe('eas');
    });
  });
});
