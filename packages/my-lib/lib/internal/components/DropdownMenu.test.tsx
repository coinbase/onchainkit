import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DropdownMenu } from './DropdownMenu';

describe('DropdownMenu', () => {
  let trigger: HTMLElement;
  const onClose = vi.fn();

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

    trigger = document.createElement('button');
    trigger.setAttribute('data-testid', 'trigger');
    document.body.appendChild(trigger);
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should not render when isOpen is false', () => {
      render(
        <DropdownMenu
          trigger={{ current: trigger }}
          isOpen={false}
          onClose={onClose}
        >
          Content
        </DropdownMenu>,
      );

      expect(screen.queryByTestId('ockDropdownMenu')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(
        <DropdownMenu trigger={{ current: trigger }} isOpen={true}>
          Content
        </DropdownMenu>,
      );

      expect(screen.getByTestId('ockDropdownMenu')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle null trigger gracefully', () => {
      render(
        <DropdownMenu trigger={{ current: null }} isOpen={true}>
          Content
        </DropdownMenu>,
      );

      expect(screen.getByTestId('ockDropdownMenu')).toBeInTheDocument();
    });
  });

  describe('positioning', () => {
    const alignments = ['start', 'center', 'end'] as const;

    for (const align of alignments) {
      it(`should position correctly with align=${align}`, () => {
        render(
          <DropdownMenu
            trigger={{ current: trigger }}
            isOpen={true}
            align={align}
            offset={8}
          >
            Content
          </DropdownMenu>,
        );

        const dropdown = screen.getByTestId('ockDropdownMenu');
        expect(dropdown).toBeInTheDocument();
        expect(dropdown.style.top).toBeDefined();
        expect(dropdown.style.left).toBeDefined();
      });
    }

    it('should update position on window resize', () => {
      render(
        <DropdownMenu trigger={{ current: trigger }} isOpen={true}>
          Content
        </DropdownMenu>,
      );

      fireEvent(window, new Event('resize'));
      expect(screen.getByTestId('ockDropdownMenu')).toBeInTheDocument();
    });

    it('should update position on scroll', () => {
      render(
        <DropdownMenu trigger={{ current: trigger }} isOpen={true}>
          Content
        </DropdownMenu>,
      );

      fireEvent.scroll(window);
      expect(screen.getByTestId('ockDropdownMenu')).toBeInTheDocument();
    });

    it('should handle missing getBoundingClientRect gracefully', () => {
      const originalGetBoundingClientRect =
        Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = vi
        .fn()
        .mockReturnValue(undefined);

      render(
        <DropdownMenu trigger={{ current: trigger }} isOpen={true}>
          Content
        </DropdownMenu>,
      );

      const dropdown = screen.getByTestId('ockDropdownMenu');
      expect(dropdown).toBeInTheDocument();

      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });

    it('should handle null trigger and contentRef gracefully', () => {
      const originalGetBoundingClientRect =
        Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = vi
        .fn()
        .mockReturnValue(undefined);

      render(
        <DropdownMenu trigger={{ current: null }} isOpen={true}>
          Content
        </DropdownMenu>,
      );

      const dropdown = screen.getByTestId('ockDropdownMenu');
      expect(dropdown).toBeInTheDocument();

      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });

    it('should handle undefined trigger rect gracefully', () => {
      const mockTrigger = document.createElement('button');
      const mockGetBoundingClientRect = vi.fn().mockReturnValue(undefined);
      mockTrigger.getBoundingClientRect = mockGetBoundingClientRect;

      render(
        <DropdownMenu trigger={{ current: mockTrigger }} isOpen={true}>
          Content
        </DropdownMenu>,
      );

      const dropdown = screen.getByTestId('ockDropdownMenu');
      fireEvent(window, new Event('resize'));

      expect(dropdown).toBeInTheDocument();
      expect(mockGetBoundingClientRect).toHaveBeenCalled();
    });

    it('should handle null trigger ref gracefully', () => {
      render(
        <DropdownMenu trigger={{ current: null }} isOpen={true}>
          Content
        </DropdownMenu>,
      );

      const dropdown = screen.getByTestId('ockDropdownMenu');

      fireEvent(window, new Event('resize'));
      fireEvent.scroll(window);

      expect(dropdown).toBeInTheDocument();
    });

    it('should update position correctly when trigger and contentRef are valid', () => {
      const mockTrigger = document.createElement('button');

      mockTrigger.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 100,
        bottom: 150,
        left: 100,
        right: 150,
        width: 50,
        height: 50,
        x: 100,
        y: 100,
        toJSON() {
          return this;
        },
      });

      const mockDropdownRect = {
        top: 158,
        bottom: 208,
        left: 100,
        right: 150,
        width: 50,
        height: 50,
        x: 100,
        y: 158,
        toJSON() {
          return this;
        },
      };

      const originalGetBoundingClientRect =
        Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = vi
        .fn()
        .mockReturnValue(mockDropdownRect);

      render(
        <DropdownMenu trigger={{ current: mockTrigger }} isOpen={true}>
          <div>Content</div>
        </DropdownMenu>,
      );

      const dropdown = screen.getByTestId('ockDropdownMenu');

      expect(dropdown.style.top).toBe(
        `${mockTrigger.getBoundingClientRect().bottom + 8}px`,
      );
      expect(dropdown.style.left).toBe(`${mockDropdownRect.left}px`);

      fireEvent(window, new Event('resize'));
      expect(mockTrigger.getBoundingClientRect).toHaveBeenCalled();

      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });
  });

  describe('interactions', () => {
    it('should not call onClose when clicking inside', () => {
      render(
        <DropdownMenu
          trigger={{ current: trigger }}
          isOpen={true}
          onClose={onClose}
        >
          <button type="button">Menu Item</button>
        </DropdownMenu>,
      );

      fireEvent.mouseDown(screen.getByText('Menu Item'));
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should call onClose when clicking outside', () => {
      render(
        <DropdownMenu
          trigger={{ current: trigger }}
          isOpen={true}
          onClose={onClose}
        >
          Content
        </DropdownMenu>,
      );

      fireEvent.pointerDown(document.body);
      expect(onClose).toHaveBeenCalled();
    });

    it('should call onClose when pressing Escape', () => {
      render(
        <DropdownMenu
          trigger={{ current: trigger }}
          isOpen={true}
          onClose={onClose}
        >
          Content
        </DropdownMenu>,
      );

      fireEvent.keyDown(document.body, { key: 'Escape' });
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have correct ARIA attributes', () => {
      render(
        <DropdownMenu
          trigger={{ current: trigger }}
          isOpen={true}
          aria-label="Test Menu"
        >
          Content
        </DropdownMenu>,
      );

      const menu = screen.getByTestId('ockDropdownMenu');
      expect(menu).toHaveAttribute('role', 'listbox');
      expect(menu).toHaveAttribute('aria-label', 'Test Menu');
    });

    it('should trap focus when open', async () => {
      render(
        <DropdownMenu trigger={{ current: trigger }} isOpen={true}>
          <button type="button">First</button>
          <button type="button">Second</button>
        </DropdownMenu>,
      );

      const firstButton = screen.getByText('First');
      expect(document.activeElement).toBe(firstButton);
    });
  });

  describe('cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(
        <DropdownMenu trigger={{ current: trigger }} isOpen={true}>
          Content
        </DropdownMenu>,
      );

      unmount();
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    });

    it('should handle unmount when not open', () => {
      const { unmount } = render(
        <DropdownMenu trigger={{ current: trigger }} isOpen={false}>
          Content
        </DropdownMenu>,
      );

      unmount();
    });
  });

  it('handles null trigger or content refs', () => {
    const nullTrigger = createRef<HTMLElement>();

    render(
      <DropdownMenu isOpen={true} trigger={nullTrigger}>
        <div>Content</div>
      </DropdownMenu>,
    );

    const menu = screen.getByTestId('ockDropdownMenu');
    expect(menu).toBeInTheDocument();
  });
});
