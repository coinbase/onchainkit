import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DropdownMenu } from './DropdownMenu';

describe('DropdownMenu', () => {
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
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should not render when isOpen is false', () => {
      render(
        <DropdownMenu
          trigger={<button>Trigger</button>}
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
        <DropdownMenu trigger={<button>Trigger</button>} isOpen={true}>
          Content
        </DropdownMenu>,
      );

      expect(screen.getByTestId('ockDropdownMenu')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle null trigger gracefully', () => {
      render(
        <DropdownMenu trigger={null} isOpen={true}>
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
            trigger={<button>Trigger</button>}
            isOpen={true}
            align={align}
            sideOffset={8}
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
        <DropdownMenu trigger={<button>Trigger</button>} isOpen={true}>
          Content
        </DropdownMenu>,
      );

      fireEvent(window, new Event('resize'));
      expect(screen.getByTestId('ockDropdownMenu')).toBeInTheDocument();
    });

    it('should update position on scroll', () => {
      render(
        <DropdownMenu trigger={<button>Trigger</button>} isOpen={true}>
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
        <DropdownMenu trigger={<button>Trigger</button>} isOpen={true}>
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
        <DropdownMenu trigger={null} isOpen={true}>
          Content
        </DropdownMenu>,
      );

      const dropdown = screen.getByTestId('ockDropdownMenu');
      expect(dropdown).toBeInTheDocument();

      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });
  });

  describe('interactions', () => {
    it('should not call onClose when clicking inside', () => {
      render(
        <DropdownMenu
          trigger={<button>Trigger</button>}
          isOpen={true}
          onClose={onClose}
        >
          <button type="button">Menu Item</button>
        </DropdownMenu>,
      );

      fireEvent.mouseDown(screen.getByText('Menu Item'));
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should call onClose when pressing Escape', () => {
      render(
        <DropdownMenu
          trigger={<button>Trigger</button>}
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
          trigger={<button>Trigger</button>}
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
  });
});
