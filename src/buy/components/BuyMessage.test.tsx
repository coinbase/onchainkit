import { render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { BuyMessage } from './BuyMessage';
import { useBuyContext } from './BuyProvider';

vi.mock('./BuyProvider', () => ({
  useBuyContext: vi.fn(),
}));

describe('BuyMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders null when statusName is not "error"', () => {
    (useBuyContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'success' },
    });

    const { container } = render(<BuyMessage />);
    expect(container.firstChild).toBeNull();
  });

  it('renders error message when statusName is "error"', () => {
    (useBuyContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'error' },
    });

    render(<BuyMessage />);

    expect(
      screen.getByText('Something went wrong. Please try again.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Something went wrong. Please try again.'),
    ).toHaveClass('text-sm');
  });
});
