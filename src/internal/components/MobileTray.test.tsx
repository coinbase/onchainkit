import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MobileTray } from './MobileTray';

describe('MobileTray', () => {
  const defaultProps = {
    isOpen: true,
    onOverlayClick: vi.fn(),
    onEscKeyPress: vi.fn(),
    onAnimationEnd: vi.fn(),
    children: <div>Test Content</div>,
  };

  it('renders children when open', () => {
    render(<MobileTray {...defaultProps} />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders overlay when open', () => {
    render(<MobileTray {...defaultProps} />);
    expect(screen.getByRole('presentation')).toHaveClass(
      'bg-black bg-opacity-20',
    );
  });

  it('does not render overlay when closed', () => {
    render(<MobileTray {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('calls onOverlayClick when overlay is clicked', () => {
    render(<MobileTray {...defaultProps} />);
    fireEvent.click(screen.getByRole('presentation'));
    expect(defaultProps.onOverlayClick).toHaveBeenCalled();
  });

  it('calls onEscKeyPress when Escape key is pressed on overlay', () => {
    render(<MobileTray {...defaultProps} />);
    fireEvent.keyDown(screen.getByRole('presentation'), { key: 'Escape' });
    expect(defaultProps.onEscKeyPress).toHaveBeenCalled();
  });

  it('calls onAnimationEnd when animation completes', () => {
    render(<MobileTray {...defaultProps} />);
    fireEvent.animationEnd(screen.getByTestId('ockMobileTray'));
    expect(defaultProps.onAnimationEnd).toHaveBeenCalled();
  });

  it('applies custom animation classes when provided', () => {
    render(
      <MobileTray
        {...defaultProps}
        animation={{ tray: 'custom-tray', overlay: 'custom-overlay' }}
      />,
    );
    expect(screen.getByTestId('ockMobileTray')).toHaveClass('custom-tray');
    expect(screen.getByRole('presentation')).toHaveClass('custom-overlay');
  });

  it('applies default translation classes when no animation prop is provided', () => {
    const { rerender } = render(<MobileTray {...defaultProps} />);
    expect(screen.getByTestId('ockMobileTray')).toHaveClass('translate-y-0');

    rerender(<MobileTray {...defaultProps} isOpen={false} />);
    expect(screen.getByTestId('ockMobileTray')).toHaveClass('translate-y-full');
  });

  it('applies custom className when provided', () => {
    render(<MobileTray {...defaultProps} className="custom-class" />);
    expect(screen.getByTestId('ockMobileTray')).toHaveClass('custom-class');
  });
});
