import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { Tab } from './Tab';
import { Tabs, useTabsContext } from './Tabs';

vi.mock('@/core-react/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('./Tabs', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('./Tabs')>()),
    useTabsContext: vi.fn(),
  };
});

const mockSetSelectedTab = vi.fn();
const mockUseTabsContext = vi.fn().mockReturnValue({
  selectedTab: 'tab1',
  setSelectedTab: mockSetSelectedTab,
});

describe('Tab', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useTabsContext as Mock) = mockUseTabsContext;
  });

  it('renders children correctly', () => {
    render(
      <Tabs defaultValue="tab1">
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2">Tab 2</Tab>
      </Tabs>,
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  it('calls setSelectedTab when the tab is clicked', () => {
    render(
      <Tabs defaultValue="tab1">
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2">Tab 2</Tab>
      </Tabs>,
    );
    
    const tab2 = screen.getByText('Tab 2');
    fireEvent.click(tab2);

    expect(mockSetSelectedTab).toHaveBeenCalledWith('tab2');
  });

  it('applies custom className', () => {
    render(
      <Tabs defaultValue="tab1">
        <Tab value="tab1" className="custom-class">
          Tab 1
        </Tab>
      </Tabs>,
    );

    const tab1 = screen.getByText('Tab 1');
    expect(tab1).toHaveClass('custom-class');
  });

  it('applies the correct aria-label and role', () => {
    render(
      <Tabs defaultValue="tab1">
        <Tab value="tab1" aria-label="Tab 1 Label">
          Tab 1
        </Tab>
      </Tabs>,
    );

    const tab1 = screen.getByText('Tab 1');
    expect(tab1).toHaveAttribute('aria-label', 'Tab 1 Label');
    expect(tab1).toHaveAttribute('role', 'tab');
  });
});
