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
});
