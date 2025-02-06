import { usdcToken } from '@/token/constants';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EarnDetails } from './EarnDetails';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('EarnDetails Component', () => {
  it('renders skeleton when token is not provided', () => {
    render(<EarnDetails />);
    expect(screen.getByTestId('ockSkeleton')).toBeInTheDocument();
  });

  it('renders TokenChip with the correct props', () => {
    render(<EarnDetails token={usdcToken} tag="test" />);

    const tokenChip = screen.getByTestId('ockTokenChip_Button');
    expect(tokenChip).toBeInTheDocument();
    expect(tokenChip).toHaveTextContent('USDC');
    expect(tokenChip).toHaveClass('!bg-transparent');
  });

  it('applies custom className to the container', () => {
    const customClass = 'custom-class';
    render(<EarnDetails token={usdcToken} className={customClass} />);

    const container = screen.getByTestId('ockTokenChip_Button').parentElement;
    expect(container).toHaveClass(customClass);
  });
});
