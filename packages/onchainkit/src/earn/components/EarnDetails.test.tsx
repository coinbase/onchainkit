import { EarnDetails } from '@/earn/components/EarnDetails';
import { MOCK_EARN_CONTEXT } from '@/earn/mocks/mocks.test';
import { render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEarnContext } from './EarnProvider';

vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('EarnDetails Component', () => {
  const mockUseEarnContext = useEarnContext as Mock;

  beforeEach(() => {
    mockUseEarnContext.mockReturnValue(MOCK_EARN_CONTEXT);
  });

  it('renders error message when error is present', () => {
    mockUseEarnContext.mockReturnValue({
      ...MOCK_EARN_CONTEXT,
      error: new Error('Test error'),
    });

    render(<EarnDetails />);

    const errorMessage = screen.getByText('Error fetching vault details');
    expect(errorMessage).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-class';
    render(<EarnDetails className={customClass} />);

    const container = screen.getByTestId('ockEarnDetails');
    expect(container).toHaveClass(customClass);
  });
});
