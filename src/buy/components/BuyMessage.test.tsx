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
      lifecycleStatus: { statusName: 'error', statusData: { error: '' } },
    });

    render(<BuyMessage />);

    expect(
      screen.getByText('Something went wrong. Please try again.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Something went wrong. Please try again.'),
    ).toHaveClass('text-sm');
    expect(
      screen.getByText('Something went wrong. Please try again.'),
    ).toHaveClass('ock-text-error');
  });

  it('renders missing required fields message', () => {
    (useBuyContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: 'error',
        statusData: {
          code: 'TmBPc05',
          error: 'Missing required fields',
          message: 'Complete the field to continue',
        },
      },
    });

    render(<BuyMessage />);

    expect(
      screen.getByText('Complete the field to continue'),
    ).toBeInTheDocument();
    expect(screen.getByText('Complete the field to continue')).toHaveClass(
      'text-sm',
    );
    expect(screen.getByText('Complete the field to continue')).toHaveClass(
      'ock-text-foreground-muted',
    );
  });
});
