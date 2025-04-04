import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TabContent } from './TabContent';
import { Tabs } from './Tabs';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('TabContent', () => {
  it('renders children when the value matches the selected tab', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabContent value="tab1">Content for Tab 1</TabContent>
        <TabContent value="tab2">Content for Tab 2</TabContent>
      </Tabs>,
    );

    expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
    expect(screen.queryByText('Content for Tab 2')).not.toBeInTheDocument();
  });

  it('does not render children when the value does not match the selected tab', () => {
    render(
      <Tabs defaultValue="tab2">
        <TabContent value="tab1">Content for Tab 1</TabContent>
        <TabContent value="tab2">Content for Tab 2</TabContent>
      </Tabs>,
    );

    expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
    expect(screen.queryByText('Content for Tab 1')).not.toBeInTheDocument();
  });

  it('applies the className prop to the container', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabContent value="tab1" className="custom-class">
          Content for Tab 1
        </TabContent>
      </Tabs>,
    );

    const content = screen.getByText('Content for Tab 1');
    expect(content).toHaveClass('custom-class');
  });

  it('throws an error if used outside of TabsProvider', () => {
    const originalError = console.error;
    console.error = vi.fn();

    expect(() =>
      render(<TabContent value="tab1">Content for Tab 1</TabContent>),
    ).toThrow('useTabsContext must be used within an TabsProvider');

    console.error = originalError;
  });
});
