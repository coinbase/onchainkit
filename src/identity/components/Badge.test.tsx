/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from './Badge';

describe('WithAvatarBadge Component', () => {
  it('should render the svg', async () => {
    render(<Badge />);

    await waitFor(() => {
      const inner = screen.queryByTestId('badge');
      expect(inner).toBeInTheDocument();
    });
  });

  it('should render the default svg with a blue background and white border and size 12', async () => {
    render(<Badge />);

    await waitFor(() => {
      const inner = screen.queryByTestId('badge');
      expect(inner).toHaveAttribute('width', '12');
      expect(inner).toHaveAttribute('height', '12');
      const background = screen.queryByTestId('badgeBackground');
      expect(background).toHaveAttribute('fill', '#0052FF');
      const border = screen.queryByTestId('badgeBorder');
      expect(border).toHaveAttribute('fill', 'white');
    });
  });

  it('should render the svg with a custom background color', async () => {
    render(<Badge backgroundColor="red" />);

    await waitFor(() => {
      const inner = screen.queryByTestId('badgeBackground');
      expect(inner).toHaveAttribute('fill', 'red');
    });
  });

  it('should render the svg with a custom border color', async () => {
    render(<Badge borderColor="red" />);

    await waitFor(() => {
      const inner = screen.queryByTestId('badgeBorder');
      expect(inner).toHaveAttribute('fill', 'red');
    });
  });

  it('should render the svg with a custom size', async () => {
    render(<Badge size="24" />);

    await waitFor(() => {
      const inner = screen.queryByTestId('badge');
      expect(inner).toHaveAttribute('width', '24');
      expect(inner).toHaveAttribute('height', '24');
    });
  });
});
