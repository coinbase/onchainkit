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

  it('should render the svg with a custom background color', async () => {
    render(<Badge backgroundColor="red" />);

    await waitFor(() => {
      const inner = screen.queryByTestId('badge');
      expect(inner).toHaveStyle('fill: red');
    });
  });

  it('should render the svg with a custom border color', async () => {
    render(<Badge borderColor="red" />);

    await waitFor(() => {
      const inner = screen.queryByTestId('badge');
      expect(inner).toHaveStyle('fill: #0052FF');
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
