import { Tabs } from '@/internal/components/tabs/Tabs';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TabsList } from './TabsList';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Tabs defaultValue="tab1">{children}</Tabs>
);

describe('TabsList', () => {
  it('renders children correctly', () => {
    render(
      <TabsList>
        <div>Tab 1</div>
        <div>Tab 2</div>
      </TabsList>,
      { wrapper },
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  it('applies default styles', () => {
    render(
      <TabsList>
        <div>Tab 1</div>
      </TabsList>,
      { wrapper },
    );

    const tabsList = screen.getByText('Tab 1').parentElement;
    expect(tabsList).toHaveClass('flex overflow-hidden');
  });

  it('applies custom className', () => {
    render(
      <TabsList className="custom-class">
        <div>Tab 1</div>
      </TabsList>,
      { wrapper },
    );

    const tabsList = screen.getByText('Tab 1').parentElement;
    expect(tabsList).toHaveClass('custom-class');
  });

  it('merges default and custom className', () => {
    render(
      <TabsList className="custom-class">
        <div>Tab 1</div>
      </TabsList>,
      { wrapper },
    );

    const tabsList = screen.getByText('Tab 1').parentElement;
    expect(tabsList).toHaveClass('flex overflow-hidden custom-class');
  });

  // Add tests for keyboard navigation
  describe('keyboard navigation', () => {
    const mockSetSelectedTab = vi.fn();

    beforeEach(() => {
      mockSetSelectedTab.mockClear();
    });

    it('navigates to next tab with ArrowRight key', () => {
      render(
        <TabsList>
          <div role="tab" tabIndex={0} aria-controls="tab1-panel">
            Tab 1
          </div>
          <div role="tab" tabIndex={-1} aria-controls="tab2-panel">
            Tab 2
          </div>
          <div role="tab" tabIndex={-1} aria-controls="tab3-panel">
            Tab 3
          </div>
        </TabsList>,
        { wrapper },
      );

      const firstTab = screen.getByText('Tab 1');
      firstTab.focus();

      fireEvent.keyDown(firstTab, { key: 'ArrowRight' });

      // Check that focus moved to the next tab
      expect(document.activeElement).toBe(screen.getByText('Tab 2'));
    });

    it('navigates to previous tab with ArrowLeft key', () => {
      render(
        <TabsList>
          <div role="tab" tabIndex={0} aria-controls="tab1-panel">
            Tab 1
          </div>
          <div role="tab" tabIndex={-1} aria-controls="tab2-panel">
            Tab 2
          </div>
          <div role="tab" tabIndex={-1} aria-controls="tab3-panel">
            Tab 3
          </div>
        </TabsList>,
        { wrapper },
      );

      const secondTab = screen.getByText('Tab 2');
      secondTab.focus();

      fireEvent.keyDown(secondTab, { key: 'ArrowLeft' });

      // Check that focus moved to the previous tab
      expect(document.activeElement).toBe(screen.getByText('Tab 1'));
    });

    it('wraps around to the first tab when pressing ArrowRight on the last tab', () => {
      render(
        <TabsList>
          <div role="tab" tabIndex={0} aria-controls="tab1-panel">
            Tab 1
          </div>
          <div role="tab" tabIndex={-1} aria-controls="tab2-panel">
            Tab 2
          </div>
          <div role="tab" tabIndex={-1} aria-controls="tab3-panel">
            Tab 3
          </div>
        </TabsList>,
        { wrapper },
      );

      const lastTab = screen.getByText('Tab 3');
      lastTab.focus();

      fireEvent.keyDown(lastTab, { key: 'ArrowRight' });

      // Check that focus wrapped around to the first tab
      expect(document.activeElement).toBe(screen.getByText('Tab 1'));
    });

    it('wraps around to the last tab when pressing ArrowLeft on the first tab', () => {
      render(
        <TabsList>
          <div role="tab" tabIndex={0} aria-controls="tab1-panel">
            Tab 1
          </div>
          <div role="tab" tabIndex={-1} aria-controls="tab2-panel">
            Tab 2
          </div>
          <div role="tab" tabIndex={-1} aria-controls="tab3-panel">
            Tab 3
          </div>
        </TabsList>,
        { wrapper },
      );

      const firstTab = screen.getByText('Tab 1');
      firstTab.focus();

      fireEvent.keyDown(firstTab, { key: 'ArrowLeft' });

      // Check that focus wrapped around to the last tab
      expect(document.activeElement).toBe(screen.getByText('Tab 3'));
    });

    it('does nothing for other key presses', () => {
      render(
        <TabsList>
          <div role="tab" tabIndex={0} aria-controls="tab1-panel">
            Tab 1
          </div>
          <div role="tab" tabIndex={-1} aria-controls="tab2-panel">
            Tab 2
          </div>
        </TabsList>,
        { wrapper },
      );

      const firstTab = screen.getByText('Tab 1');
      firstTab.focus();

      fireEvent.keyDown(firstTab, { key: 'Enter' });

      // Focus should not change
      expect(document.activeElement).toBe(firstTab);
    });
  });

  it('handles case when querySelectorAll returns null', () => {
    render(
      <TabsList>
        <div role="tab" tabIndex={0} data-testid="tab-element">
          Tab 1
        </div>
      </TabsList>,
      { wrapper },
    );

    const tabElement = screen.getByTestId('tab-element');
    tabElement.focus();

    // Mock querySelectorAll to return null
    const originalQuerySelectorAll = Element.prototype.querySelectorAll;
    // @ts-expect-error - this is a test
    Element.prototype.querySelectorAll = () => null;

    fireEvent.keyDown(tabElement, { key: 'ArrowRight' });

    // Restore original method
    Element.prototype.querySelectorAll = originalQuerySelectorAll;

    // Focus should not change
    expect(document.activeElement).toBe(tabElement);
  });
});
