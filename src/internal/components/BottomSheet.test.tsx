import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BottomSheet } from './BottomSheet';

vi.mock('../../internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('BottomSheet', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Test Content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when open', () => {
    render(<BottomSheet {...defaultProps} />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('does not render children when closed', () => {
    render(<BottomSheet {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('calls onClose when Escape key is pressed on overlay', () => {
    render(<BottomSheet {...defaultProps} />);
    fireEvent.keyDown(screen.getByTestId('ockDismissableLayer'), {
      key: 'Escape',
    });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('applies custom className when provided', () => {
    render(<BottomSheet {...defaultProps} className="custom-class" />);
    expect(screen.getByTestId('ockBottomSheet')).toHaveClass('custom-class');
  });

  it('sets all ARIA attributes correctly', () => {
    render(
      <BottomSheet
        {...defaultProps}
        aria-label="Test Dialog"
        aria-describedby="desc"
        aria-labelledby="title"
      >
        <div>Content</div>
      </BottomSheet>,
    );

    const sheet = screen.getByTestId('ockBottomSheet');
    expect(sheet).toHaveAttribute('role', 'dialog');
    expect(sheet).toHaveAttribute('aria-label', 'Test Dialog');
    expect(sheet).toHaveAttribute('aria-describedby', 'desc');
    expect(sheet).toHaveAttribute('aria-labelledby', 'title');
  });
});
