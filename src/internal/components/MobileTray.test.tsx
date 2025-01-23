import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MobileTray } from './MobileTray';

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('MobileTray', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Test Content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when open', () => {
    render(<MobileTray {...defaultProps} />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders overlay when open', () => {
    render(<MobileTray {...defaultProps} />);
    expect(screen.getByTestId('ockMobileTrayOverlay')).toBeInTheDocument();
  });

  it('does not render overlay when closed', () => {
    render(<MobileTray {...defaultProps} isOpen={false} />);
    expect(
      screen.queryByTestId('ockMobileTrayOverlay'),
    ).not.toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    render(<MobileTray {...defaultProps} />);
    fireEvent.pointerDown(screen.getByTestId('ockMobileTrayOverlay'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed on overlay', () => {
    render(<MobileTray {...defaultProps} />);
    fireEvent.keyDown(screen.getByTestId('ockDismissableLayer'), {
      key: 'Escape',
    });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('applies custom className when provided', () => {
    render(<MobileTray {...defaultProps} className="custom-class" />);
    expect(screen.getByTestId('ockMobileTray')).toHaveClass('custom-class');
  });

  it('sets all ARIA attributes correctly', () => {
    render(
      <MobileTray
        {...defaultProps}
        aria-label="Test Dialog"
        aria-describedby="desc"
        aria-labelledby="title"
      >
        <div>Content</div>
      </MobileTray>,
    );

    const tray = screen.getByTestId('ockMobileTray');
    expect(tray).toHaveAttribute('role', 'dialog');
    expect(tray).toHaveAttribute('aria-label', 'Test Dialog');
    expect(tray).toHaveAttribute('aria-describedby', 'desc');
    expect(tray).toHaveAttribute('aria-labelledby', 'title');
  });
});
