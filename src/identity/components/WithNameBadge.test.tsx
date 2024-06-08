/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useOnchainKit } from '../../useOnchainKit';
import { useAttestations } from '../hooks/useAttestations';
import { WithNameBadge } from './WithNameBadge';
import { base } from 'viem/chains';

jest.mock('../../useOnchainKit', () => ({
  useOnchainKit: jest.fn(),
}));

jest.mock('../hooks/useAttestations', () => ({
  useAttestations: jest.fn(),
}));

describe('WithNameBadge Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render inner component', async () => {
    (useOnchainKit as jest.Mock).mockReturnValue({
      chain: base,
      schemaId: '0xschema',
    });

    render(
      <WithNameBadge address="0x123" showAttestation={false}>
        test
      </WithNameBadge>,
    );

    await waitFor(() => {
      const inner = screen.queryByTestId('ockNameBadgeContainer');
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
      <WithNameBadge address="0x123" showAttestation={true}>
        test
      </WithNameBadge>,
    );

    await waitFor(() => {
      const inner = screen.getByTestId('ockNameBadgeContainer');
      expect(inner).toBeInTheDocument();
      const badge = screen.queryByTestId('ockBadge');
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
      <WithNameBadge address="0x123" showAttestation={true}>
        test
      </WithNameBadge>,
    );

    await waitFor(() => {
      const inner = screen.getByTestId('ockNameBadgeContainer');
      expect(inner).toBeInTheDocument();
      const badge = screen.getByTestId('ockBadge');
      expect(badge).toBeInTheDocument();
    });
  });

  it('should log error message when schemaId is not provided', async () => {
    (useOnchainKit as jest.Mock).mockReturnValue({
      chain: base,
      schemaId: null,
    });

    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <WithNameBadge address="0x123" showAttestation={true}>
        test
      </WithNameBadge>,
    );

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(
        'EAS schemaId must provided in OnchainKitProvider context when using WithNameBadge showAttestation is true.',
      );
    });
  });
});
