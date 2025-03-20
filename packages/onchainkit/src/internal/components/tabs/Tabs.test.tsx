import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, useTabsContext } from './Tabs';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

function Tab({ name }: { name: string }) {
  const { selectedTab, setSelectedTab } = useTabsContext();
  return (
    <div>
      <button
        onClick={() => setSelectedTab(name)}
        data-testid={`tab-button-${name}`}
        type="button"
      >
        {name}
      </button>
      {selectedTab === name && (
        <span data-testid="active-tab">{name} is active</span>
      )}
    </div>
  );
}

describe('Tabs', () => {
  it('renders children correctly', () => {
    render(
      <Tabs defaultValue="tab1">
        <Tab name="tab1" />
        <Tab name="tab2" />
      </Tabs>,
    );

    expect(screen.getByText('tab1')).toBeInTheDocument();
    expect(screen.getByText('tab2')).toBeInTheDocument();
  });

  it('provides the default selected tab context', () => {
    render(
      <Tabs defaultValue="tab1">
        <Tab name="tab1" />
        <Tab name="tab2" />
      </Tabs>,
    );

    expect(screen.getByTestId('active-tab')).toHaveTextContent(
      'tab1 is active',
    );
  });

  it('updates the selected tab on button click', () => {
    render(
      <Tabs defaultValue="tab1">
        <Tab name="tab1" />
        <Tab name="tab2" />
      </Tabs>,
    );

    const tab2Button = screen.getByTestId('tab-button-tab2');
    fireEvent.click(tab2Button);

    expect(screen.getByTestId('active-tab')).toHaveTextContent(
      'tab2 is active',
    );
  });

  it('throws an error if useTabsContext is used outside of TabsProvider', () => {
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => render(<Tab name="tab1" />)).toThrow(
      'useTabsContext must be used within an TabsProvider',
    );

    console.error = originalError;
  });
});
