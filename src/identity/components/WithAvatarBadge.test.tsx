/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useOnchainKit } from '../../useOnchainKit';
import { useAttestations } from '../hooks/useAttestations';
import { WithAvatarBadge } from './WithAvatarBadge';
import { base } from 'viem/chains';

jest.mock('../../useOnchainKit', () => ({
  useOnchainKit: jest.fn(),
}));

jest.mock('../hooks/useAttestations', () => ({
  useAttestations: jest.fn(),
}));

describe('WithAvatarBadge Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render inner component', async () => {
    (useOnchainKit as jest.Mock).mockReturnValue({
      chain: base,
      schemaId: '0xschema',
    });

    render(
      <WithAvatarBadge address="0x123" showAttestation={false}>
        test
      </WithAvatarBadge>,
    );

    await waitFor(() => {
      const inner = screen.queryByTestId('inner');
      expect(inner).toBeNull();
    });
  });

  it('should not render badge', async () => {
    (useOnchainKit as jest.Mock).mockReturnValue({
      chain: base,
      schemaId: '0xschema',
    });
    (useAttestations as jest.Mock).mockReturnValue(null);

    render(
      <WithAvatarBadge address="0x123" showAttestation={true}>
        test
      </WithAvatarBadge>,
    );

    await waitFor(() => {
      const inner = screen.getByTestId('inner');
      expect(inner).toBeInTheDocument();
      const badge = screen.queryByTestId('badge');
      expect(badge).toBeNull();
    });
  });

  it('should render badge', async () => {
    (useOnchainKit as jest.Mock).mockReturnValue({
      chain: base,
      schemaId: '0xschema',
    });
    const attestation = {};
    (useAttestations as jest.Mock).mockReturnValue([attestation]);

    render(
      <WithAvatarBadge address="0x123" showAttestation={true}>
        test
      </WithAvatarBadge>,
    );

    await waitFor(() => {
      const inner = screen.getByTestId('inner');
      expect(inner).toBeInTheDocument();
      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
    });
  });
});
