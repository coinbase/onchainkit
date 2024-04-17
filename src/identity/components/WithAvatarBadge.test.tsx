/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WithAvatarBadge } from './WithAvatarBadge';
import { useAttestAddress } from '../hooks/useAttestAddress';

jest.mock('../hooks/useAttestAddress', () => ({
  useAttestAddress: jest.fn(),
}));

describe('WithAvatarBadge Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render inner component', async () => {
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
    (useAttestAddress as jest.Mock).mockReturnValue(null);

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
    (useAttestAddress as jest.Mock).mockReturnValue('eas');

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
