import { render, screen, waitFor } from '@testing-library/react';
/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { Badge } from './Badge';

describe('WithAvatarBadge Component', () => {
  it('should render the svg', async () => {
    render(<Badge />);

    await waitFor(() => {
      const inner = screen.queryByTestId('ockBadge');
      expect(inner).toBeInTheDocument();
    });
  });

  it('should render the default svg with a blue background and no border', async () => {
    render(<Badge />);

    await waitFor(() => {
      const badge = screen.queryByTestId('ockBadge');
      expect(badge).toHaveStyle('border-radius: 50%; height: 12px; width: 12px;');
      const bg = screen.queryByTestId('ockBadgeBackground');
      expect(bg).toHaveAttribute('fill', '#0052FF');
      const ticker = screen.queryByTestId('ockBadgeTicker');
      expect(ticker).toHaveAttribute('fill', 'white');
    });
  });

  it('should render the badge with a red border', async () => {
    render(<Badge borderColor="red" />);

    await waitFor(() => {
      const badge = screen.queryByTestId('ockBadge');
      expect(badge).toHaveStyle(
        'border: 1px solid red; border-radius: 50%; height: 14px; width: 14px;',
      );
      const bg = screen.queryByTestId('ockBadgeBackground');
      expect(bg).toHaveAttribute('fill', '#0052FF');
      const ticker = screen.queryByTestId('ockBadgeTicker');
      expect(ticker).toHaveAttribute('fill', 'white');
    });
  });

  it('should render the badge with a green background', async () => {
    render(<Badge backgroundColor="green" />);

    await waitFor(() => {
      const badge = screen.queryByTestId('ockBadge');
      expect(badge).toHaveStyle('border-radius: 50%; height: 12px; width: 12px;');
      const bg = screen.queryByTestId('ockBadgeBackground');
      expect(bg).toHaveAttribute('fill', 'green');
      const ticker = screen.queryByTestId('ockBadgeTicker');
      expect(ticker).toHaveAttribute('fill', 'white');
    });
  });

  it('should render the badge with a yellow ticker', async () => {
    render(<Badge tickerColor="yellow" />);

    await waitFor(() => {
      const badge = screen.queryByTestId('ockBadge');
      expect(badge).toHaveStyle('border-radius: 50%; height: 12px; width: 12px;');
      const bg = screen.queryByTestId('ockBadgeBackground');
      expect(bg).toHaveAttribute('fill', '#0052FF');
      const ticker = screen.queryByTestId('ockBadgeTicker');
      expect(ticker).toHaveAttribute('fill', 'yellow');
    });
  });
});
