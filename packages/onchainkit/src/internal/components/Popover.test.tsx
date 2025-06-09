import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Popover } from './Popover';
import { LayerConfigProvider } from './LayerConfigProvider';

describe('Popover', () => {
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
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should not render when isOpen is false', () => {
      render(
        <Popover trigger={<button type="button">Trigger</button>} open={false}>
          Popover Content
        </Popover>,
      );

      expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(
        <Popover trigger={<button type="button">Trigger</button>} open={true}>
          Popover Content
        </Popover>,
      );

      expect(screen.getByText('Popover Content')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should not call onOpenChange when clicking inside', async () => {
      const onOpenChange = vi.fn();
      render(
        <Popover
          trigger={<button type="button">Trigger</button>}
          open={true}
          onOpenChange={onOpenChange}
        >
          Popover Content
        </Popover>,
      );

      fireEvent.mouseDown(screen.getByText('Popover Content'));
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('should call onOpenChange when pressing Escape', async () => {
      const onOpenChange = vi.fn();
      render(
        <Popover
          trigger={<button type="button">Trigger</button>}
          open={true}
          onOpenChange={onOpenChange}
        >
          Popover Content
        </Popover>,
      );

      fireEvent.keyDown(document.body, { key: 'Escape' });
      expect(onOpenChange).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have correct ARIA attributes', () => {
      render(
        <Popover
          trigger={<button type="button">Trigger</button>}
          open={true}
          aria-label="Test Label"
          aria-labelledby="labelId"
          aria-describedby="describeId"
        >
          Popover Content
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
        <Popover trigger={<button type="button">Trigger</button>} open={true}>
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

  describe('skipPopoverPortal', () => {
    it('should not render the popover portal when skipPopoverPortal is true', () => {
      const popover = render(
        <LayerConfigProvider skipPopoverPortal={true}>
          <div data-testid="popover-container">
            <Popover
              trigger={
                <button type="button" data-testid="trigger">
                  Trigger
                </button>
              }
              open={true}
            >
              Popover Content
            </Popover>
          </div>
        </LayerConfigProvider>,
      );

      const popoverContent = popover.getByTestId('ockPopover');
      const popoverContainer = popover.getByTestId('popover-container');
      expect(popoverContent).toBeInTheDocument();
      expect(popoverContainer.contains(popoverContent)).toBe(true);
    });

    it('should render the popover portal when skipPopoverPortal is false', () => {
      const popover = render(
        <LayerConfigProvider skipPopoverPortal={false}>
          <div data-testid="popover-container">
            <Popover
              trigger={
                <button type="button" data-testid="trigger">
                  Trigger
                </button>
              }
              open={true}
            >
              Popover Content
            </Popover>
          </div>
        </LayerConfigProvider>,
      );

      const popoverContent = popover.getByTestId('ockPopover');
      const popoverContainer = popover.getByTestId('popover-container');
      expect(popoverContent).toBeInTheDocument();
      expect(popoverContainer.contains(popoverContent)).toBe(false);
    });
  });
});
