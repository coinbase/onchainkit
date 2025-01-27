import { usdcToken } from '@/token/constants';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EarnDetails } from './EarnDetails';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('EarnDetails Component', () => {
  it('renders nothing when token is not provided', () => {
    const { container } = render(<EarnDetails />);
    expect(container.firstChild).toBeNull();
  });

  it('renders TokenChip with the correct props', () => {
    render(<EarnDetails token={usdcToken} tag="test" />);

    const tokenChip = screen.getByTestId('ockTokenChip_Button');
    expect(tokenChip).toBeInTheDocument();
    expect(tokenChip).toHaveTextContent('USDC');
    expect(tokenChip).toHaveClass('!bg-[transparent]');
  });

  it('renders tag with default styles when tagVariant is "default"', () => {
    const mockTag = 'Default Tag';
    render(
      <EarnDetails token={usdcToken} tag={mockTag} tagVariant="default" />,
    );

    const tagElement = screen.getByText(mockTag);
    expect(tagElement).toBeInTheDocument();
    expect(tagElement).toHaveClass('flex');
    expect(tagElement).toHaveClass('items-center');
    expect(tagElement).toHaveClass('justify-center');
    expect(tagElement).toHaveClass('rounded-full');
    expect(tagElement).toHaveClass('p-1');
    expect(tagElement).toHaveClass('px-3');
  });

  it('applies custom className to the container', () => {
    const customClass = 'custom-class';
    render(<EarnDetails token={usdcToken} className={customClass} />);

    const container = screen.getByTestId('ockTokenChip_Button').parentElement;
    expect(container).toHaveClass(customClass);
  });
});
