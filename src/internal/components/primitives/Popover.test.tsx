import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Popover } from './Popover';

describe('Popover', () => {
  let anchor: HTMLElement;

  beforeEach(() => {
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

    anchor = document.createElement('button');
    anchor.setAttribute('data-testid', 'anchor');
    document.body.appendChild(anchor);
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should not render when isOpen is false', () => {
      render(
        <Popover anchor={anchor} isOpen={false}>
          Content
        </Popover>,
      );

      expect(screen.queryByTestId('ockPopover')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(
        <Popover anchor={anchor} isOpen={true}>
          Content
        </Popover>,
      );

      expect(screen.getByTestId('ockPopover')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle null anchor gracefully', () => {
      render(
        <Popover anchor={null} isOpen={true}>
          Content
        </Popover>,
      );

      expect(screen.getByTestId('ockPopover')).toBeInTheDocument();
    });
  });

  describe('positioning', () => {
    const positions = ['top', 'right', 'bottom', 'left'] as const;
    const alignments = ['start', 'center', 'end'] as const;

    for (const position of positions) {
      for (const align of alignments) {
        it(`should position correctly with position=${position} and align=${align}`, () => {
          render(
            <Popover
              anchor={anchor}
              isOpen={true}
              position={position}
              align={align}
              offset={8}
            >
              Content
            </Popover>,
          );

          const popover = screen.getByTestId('ockPopover');
          expect(popover).toBeInTheDocument();

          expect(popover.style.top).toBeDefined();
          expect(popover.style.left).toBeDefined();
        });
      }
    }

    it('should update position on window resize', async () => {
      render(
        <Popover anchor={anchor} isOpen={true}>
          Content
        </Popover>,
      );

      fireEvent(window, new Event('resize'));

      expect(screen.getByTestId('ockPopover')).toBeInTheDocument();
    });

    it('should update position on scroll', async () => {
      render(
        <Popover anchor={anchor} isOpen={true}>
          Content
        </Popover>,
      );

      fireEvent.scroll(window);

      expect(screen.getByTestId('ockPopover')).toBeInTheDocument();
    });

    it('should handle missing getBoundingClientRect gracefully', () => {
      const originalGetBoundingClientRect =
        Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = vi
        .fn()
        .mockReturnValue(undefined);

      render(
        <Popover anchor={anchor} isOpen={true}>
          Content
        </Popover>,
      );

      const popover = screen.getByTestId('ockPopover');
      expect(popover).toBeInTheDocument();

      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });
  });

  describe('interactions', () => {
    it('should not call onClose when clicking inside', async () => {
      const onClose = vi.fn();
      render(
        <Popover anchor={anchor} isOpen={true} onClose={onClose}>
          Content
        </Popover>,
      );

      fireEvent.mouseDown(screen.getByText('Content'));
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should call onClose when pressing Escape', async () => {
      const onClose = vi.fn();
      render(
        <Popover anchor={anchor} isOpen={true} onClose={onClose}>
          Content
        </Popover>,
      );

      fireEvent.keyDown(document.body, { key: 'Escape' });
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have correct ARIA attributes', () => {
      render(
        <Popover
          anchor={anchor}
          isOpen={true}
          aria-label="Test Label"
          aria-labelledby="labelId"
          aria-describedby="describeId"
        >
          Content
        </Popover>,
      );

      const popover = screen.getByTestId('ockPopover');
      expect(popover).toHaveAttribute('role', 'dialog');
      expect(popover).toHaveAttribute('aria-label', 'Test Label');
      expect(popover).toHaveAttribute('aria-labelledby', 'labelId');
      expect(popover).toHaveAttribute('aria-describedby', 'describeId');
    });

    it('should trap focus when open', async () => {
      const user = userEvent.setup();
      render(
        <Popover anchor={anchor} isOpen={true}>
          <button type="button">First</button>
          <button type="button">Second</button>
        </Popover>,
      );

      const firstButton = screen.getByText('First');
      const secondButton = screen.getByText('Second');

      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);

      await user.tab();
      expect(document.activeElement).toBe(secondButton);

      await user.tab();
      expect(document.activeElement).toBe(firstButton);
    });
  });

  describe('cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const { unmount } = render(
        <Popover anchor={anchor} isOpen={true}>
          Content
        </Popover>,
      );

      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    });
  });
});
