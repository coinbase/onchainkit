import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Dialog } from './Dialog';

vi.mock('react-dom', () => ({
  createPortal: (node: React.ReactNode) => node,
}));

describe('Dialog', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
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

  describe('rendering', () => {
    it('renders nothing when isOpen is false', () => {
      render(
        <Dialog isOpen={false} onClose={onClose}>
          <div>Content</div>
        </Dialog>,
      );
      expect(screen.queryByTestId('ockDialog')).not.toBeInTheDocument();
    });

    it('renders content when isOpen is true', () => {
      render(
        <Dialog isOpen={true} onClose={onClose}>
          <div data-testid="content">Content</div>
        </Dialog>,
      );
      expect(screen.getByTestId('ockDialog')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('sets all ARIA attributes correctly', () => {
      render(
        <Dialog
          isOpen={true}
          aria-label="Test Dialog"
          aria-describedby="desc"
          aria-labelledby="title"
          modal={false}
          onClose={onClose}
        >
          <div>Content</div>
        </Dialog>,
      );

      const dialog = screen.getByTestId('ockDialog');
      expect(dialog).toHaveAttribute('role', 'dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Test Dialog');
      expect(dialog).toHaveAttribute('aria-describedby', 'desc');
      expect(dialog).toHaveAttribute('aria-labelledby', 'title');
      expect(dialog).toHaveAttribute('aria-modal', 'false');
    });

    it('uses default modal=true when not specified', () => {
      render(
        <Dialog isOpen={true} onClose={onClose}>
          <div>Content</div>
        </Dialog>,
      );
      expect(screen.getByTestId('ockDialog')).toHaveAttribute(
        'aria-modal',
        'true',
      );
    });
  });

  describe('event handling', () => {
    it('stops propagation of click events on dialog', () => {
      render(
        <Dialog isOpen={true} onClose={onClose}>
          <div>Content</div>
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
          <div>Content</div>
        </Dialog>,
      );

      const dialog = screen.getByTestId('ockDialog');
      for (const key of ['Enter', ' ']) {
        const event = new KeyboardEvent('keydown', { key, bubbles: true });
        const spy = vi.spyOn(event, 'stopPropagation');
        fireEvent(dialog, event);
        expect(spy).toHaveBeenCalled();
      }
    });

    it('does not stop propagation of other key events', () => {
      render(
        <Dialog isOpen={true} onClose={onClose}>
          <div>Content</div>
        </Dialog>,
      );

      const dialog = screen.getByTestId('ockDialog');
      const event = new KeyboardEvent('keydown', { key: 'A', bubbles: true });
      const spy = vi.spyOn(event, 'stopPropagation');
      fireEvent(dialog, event);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('dismissal behavior', () => {
    it('calls onClose when clicking outside', () => {
      render(
        <Dialog isOpen={true} onClose={onClose}>
          <div>Content</div>
        </Dialog>,
      );

      fireEvent.pointerDown(document.body);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when pressing Escape', () => {
      render(
        <Dialog isOpen={true} onClose={onClose}>
          <div>Content</div>
        </Dialog>,
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('handles undefined onClose prop gracefully', () => {
      render(
        <Dialog isOpen={true}>
          <div>Content</div>
        </Dialog>,
      );

      fireEvent.pointerDown(document.body);
      fireEvent.keyDown(document, { key: 'Escape' });
    });
  });

  describe('theme and styling', () => {
    it('applies correct theme classes to outer container', () => {
      const { container } = render(
        <Dialog isOpen={true} onClose={onClose}>
          <div>Content</div>
        </Dialog>,
      );

      const outerContainer = container.querySelector('[class*="fixed"]');
      const expectedClasses = [
        'fixed',
        'inset-0',
        'z-40',
        'flex',
        'items-center',
        'justify-center',
        'bg-black/50',
        'transition-opacity',
        'duration-200',
        'fade-in',
        'animate-in',
      ];

      for (const className of expectedClasses) {
        expect(outerContainer).toHaveClass(className);
      }
    });

    it('applies animation classes to dialog container', () => {
      render(
        <Dialog isOpen={true} onClose={onClose}>
          <div>Content</div>
        </Dialog>,
      );

      const dialog = screen.getByTestId('ockDialog');
      expect(dialog).toHaveClass('zoom-in-95');
      expect(dialog).toHaveClass('animate-in');
      expect(dialog).toHaveClass('duration-200');
    });
  });

  describe('portal rendering', () => {
    it('renders in portal', () => {
      const { baseElement } = render(
        <Dialog isOpen={true} onClose={onClose}>
          <div>Content</div>
        </Dialog>,
      );

      expect(baseElement.contains(screen.getByTestId('ockDialog'))).toBe(true);
    });
  });
});
