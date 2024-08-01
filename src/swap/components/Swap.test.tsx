import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { Swap } from './Swap';

vi.mock('./SwapProvider', () => ({
  SwapProvider: ({ children }) => (
    <div data-testid="mock-SwapProvider">{children}</div>
  ),
  useSwapContext: vi.fn(),
}));

describe('Swap Component', () => {
  it('should render the title correctly', () => {
    render(<Swap title="Test Swap" />);

    const title = screen.getByTestId('ockSwap_Title');
    expect(title).toHaveTextContent('Test Swap');
  });

  it('should pass className to container div', () => {
    render(<Swap className="custom-class" />);

    const container = screen.getByTestId('ockSwap_Container');
    expect(container).toHaveClass('custom-class');
  });
});
