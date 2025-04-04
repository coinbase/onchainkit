import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { Tab } from './Tab';
import { useTabsContext } from './Tabs';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('./Tabs', () => {
  return {
    useTabsContext: vi.fn(),
  };
});

const mockSetSelectedTab = vi.fn();
const mockUseTabsContext = useTabsContext as Mock;

describe('Tab', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseTabsContext.mockReturnValue({
      selectedTab: 'tab1',
      setSelectedTab: mockSetSelectedTab,
    });
  });

  it('renders children correctly', () => {
    render(<Tab value="tab1">Tab 1</Tab>);

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
  });

  it('calls setSelectedTab when the tab is clicked', () => {
    render(<Tab value="tab2">Tab 2</Tab>);

    const tab2 = screen.getByText('Tab 2');
    fireEvent.click(tab2);

    expect(mockSetSelectedTab).toHaveBeenCalledWith('tab2');
  });

  it('applies custom className', () => {
    render(
      <Tab value="tab1" className="custom-class">
        Tab 1
      </Tab>,
    );

    const tab1 = screen.getByText('Tab 1');
    expect(tab1).toHaveClass('custom-class');
  });

  it('applies the correct aria-label and role', () => {
    render(
      <Tab value="tab1" aria-label="Tab 1 Label">
        Tab 1
      </Tab>,
    );

    const tab1 = screen.getByText('Tab 1');
    expect(tab1).toHaveAttribute('aria-label', 'Tab 1 Label');
    expect(tab1).toHaveAttribute('role', 'tab');
  });

  it('runs the onClick callback when the tab is clicked', () => {
    const onClick = vi.fn();
    render(
      <Tab value="tab1" onClick={onClick}>
        Tab 1
      </Tab>,
    );

    const tab1 = screen.getByText('Tab 1');
    fireEvent.click(tab1);
  });
});
