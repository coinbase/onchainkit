/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WithNameBadge } from './WithNameBadge';
import { useAttestation } from '../hooks/useAttestation';

jest.mock('../hooks/useAttestation', () => ({
  useAttestation: jest.fn(),
}));

describe('WithNameBadge Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render inner component', async () => {
    render(
      <WithNameBadge address="0x123" showAttestation={false}>
        test
      </WithNameBadge>,
    );

    await waitFor(() => {
      const inner = screen.queryByTestId('inner');
      expect(inner).toBeNull();
    });
  });

  it('should not render badge', async () => {
    (useAttestation as jest.Mock).mockReturnValue(null);

    render(
      <WithNameBadge address="0x123" showAttestation={true}>
        test
      </WithNameBadge>,
    );

    await waitFor(() => {
      const inner = screen.getByTestId('inner');
      expect(inner).toBeInTheDocument();
      const badge = screen.queryByTestId('badge');
      expect(badge).toBeNull();
    });
  });

  it('should render badge', async () => {
    (useAttestation as jest.Mock).mockReturnValue('eas');

    render(
      <WithNameBadge address="0x123" showAttestation={true}>
        test
      </WithNameBadge>,
    );

    await waitFor(() => {
      const inner = screen.getByTestId('inner');
      expect(inner).toBeInTheDocument();
      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
    });
  });
});
