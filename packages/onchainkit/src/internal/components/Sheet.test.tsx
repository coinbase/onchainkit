import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Sheet } from './Sheet';

vi.mock('../../internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('Sheet', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Test Content</div>,
    title: 'Test Title',
    description: 'Test Description',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when open', () => {
    render(<Sheet {...defaultProps} />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('does not render children when closed', () => {
    render(<Sheet {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('calls onClose when Escape key is pressed on overlay', () => {
    render(<Sheet {...defaultProps} />);
    fireEvent.keyDown(document, {
      key: 'Escape',
    });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('applies custom className when provided', () => {
    render(<Sheet {...defaultProps} className="custom-class" />);
    expect(screen.getByTestId('ockSheet')).toHaveClass('custom-class');
  });

  it('sets all ARIA attributes correctly', () => {
    render(
      <Sheet
        {...defaultProps}
        aria-label="Test Dialog"
        aria-describedby="desc"
        aria-labelledby="title"
      >
        <div>Content</div>
      </Sheet>,
    );

    const sheet = screen.getByTestId('ockSheet');
    expect(sheet).toHaveAttribute('role', 'dialog');
    expect(sheet).toHaveAttribute('aria-label', 'Test Dialog');
    expect(sheet).toHaveAttribute('aria-describedby', 'desc');
    expect(sheet).toHaveAttribute('aria-labelledby', 'title');
  });

  describe('sides', () => {
    it('renders the sheet with the correct side', () => {
      render(<Sheet {...defaultProps} side="left" />);
      expect(screen.getByTestId('ockSheet')).toHaveClass(
        'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
      );
    });

    it('renders the sheet with the correct side', () => {
      render(<Sheet {...defaultProps} side="right" />);
      expect(screen.getByTestId('ockSheet')).toHaveClass(
        'inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      );
    });

    it('renders the sheet with the correct side', () => {
      render(<Sheet {...defaultProps} side="top" />);
      expect(screen.getByTestId('ockSheet')).toHaveClass(
        'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top rounded-b-3xl',
      );
    });

    it('renders the sheet with the correct side', () => {
      render(<Sheet {...defaultProps} side="bottom" />);
      expect(screen.getByTestId('ockSheet')).toHaveClass(
        'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom rounded-t-3xl',
      );
    });
  });
});
