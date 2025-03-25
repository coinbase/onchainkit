import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useSwapContext } from './SwapProvider';
import { SwapToggleButton } from './SwapToggleButton';

vi.mock('./SwapProvider', () => ({
  useSwapContext: vi.fn(),
}));

describe('SwapToggleButton', () => {
  it('should call handleToggle when clicked', () => {
    const handleToggleMock = vi.fn();
    (useSwapContext as Mock).mockReturnValue({
      handleToggle: handleToggleMock,
    });
    render(<SwapToggleButton />);
    const button = screen.getByTestId('SwapTokensButton');
    fireEvent.click(button);
    expect(handleToggleMock).toHaveBeenCalled();
  });

  it('should render with correct classes', () => {
    render(<SwapToggleButton className="custom-class" />);
    const button = screen.getByTestId('SwapTokensButton');
    expect(button).toHaveClass('custom-class');
  });
});
