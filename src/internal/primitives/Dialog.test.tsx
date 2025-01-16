import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Dialog } from './Dialog';

vi.mock('react-dom', () => ({
  createPortal: (node: React.ReactNode) => node,
}));

describe('Dialog', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('renders nothing when isOpen is false', () => {
    render(
      <Dialog isOpen={false} onClose={onClose}>
        <div>Dialog content</div>
      </Dialog>,
    );

    expect(screen.queryByTestId('ockDialog')).not.toBeInTheDocument();
  });

  it('renders content when isOpen is true', () => {
    render(
      <Dialog isOpen={true} onClose={onClose}>
        <div data-testid="content">Dialog content</div>
      </Dialog>,
    );

    expect(screen.getByTestId('ockDialog')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('sets correct ARIA attributes', () => {
    render(
      <Dialog
        isOpen={true}
        ariaLabel="Test Dialog"
        ariaDescribedby="dialog-desc"
        ariaLabelledby="dialog-title"
        onClose={() => {}}
      >
        <div>Dialog content</div>
      </Dialog>,
    );

    const dialog = screen.getByTestId('ockDialog');
    expect(dialog).toHaveAttribute('aria-label', 'Test Dialog');
    expect(dialog).toHaveAttribute('aria-describedby', 'dialog-desc');
    expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title');
  });

  it('sets modal attribute correctly', () => {
    render(
      <Dialog isOpen={true} modal={false}>
        <div>Dialog content</div>
      </Dialog>,
    );

    expect(screen.getByTestId('ockDialog')).toHaveAttribute(
      'aria-modal',
      'false',
    );
  });

  it('stops event propagation on dialog click', () => {
    render(
      <Dialog isOpen={true} onClose={onClose}>
        <div>Dialog content</div>
      </Dialog>,
    );

    const dialog = screen.getByTestId('ockDialog');
    const clickEvent = new MouseEvent('click', { bubbles: true });
    const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');

    fireEvent(dialog, clickEvent);
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('stops propagation of Enter and Space key events', () => {
    render(
      <Dialog isOpen={true} onClose={onClose}>
        <div>Dialog content</div>
      </Dialog>,
    );

    const dialog = screen.getByTestId('ockDialog');

    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    });
    const spaceEvent = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
    });

    const enterSpy = vi.spyOn(enterEvent, 'stopPropagation');
    const spaceSpy = vi.spyOn(spaceEvent, 'stopPropagation');

    fireEvent(dialog, enterEvent);
    fireEvent(dialog, spaceEvent);

    expect(enterSpy).toHaveBeenCalled();
    expect(spaceSpy).toHaveBeenCalled();
  });

  it('calls onClose when clicking outside or pressing Escape', () => {
    render(
      <Dialog isOpen={true} onClose={onClose}>
        <div>Dialog content</div>
      </Dialog>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.pointerDown(document.body);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
