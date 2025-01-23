import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tab } from './Tab';
import { Tabs } from './Tabs';

describe('Tab', () => {
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

  it('updates selected tab on click', () => {
    render(
      <Tabs defaultValue="tab1">
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2">Tab 2</Tab>
      </Tabs>,
    );

    const tab2 = screen.getByText('Tab 2');
    fireEvent.click(tab2);

    expect(tab2).toHaveClass('ock-bg-primary-washed');
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
        <Tab value="tab1" ariaLabel="Tab 1 Label">
          Tab 1
        </Tab>
      </Tabs>,
    );

    const tab1 = screen.getByText('Tab 1');
    expect(tab1).toHaveAttribute('aria-label', 'Tab 1 Label');
    expect(tab1).toHaveAttribute('role', 'tab');
  });

  it('throws an error if used outside of TabsProvider', () => {
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => render(<Tab value="tab1">Tab 1</Tab>)).toThrow(
      'useTabsContext must be used within an TabsProvider',
    );

    console.error = originalError;
  });
});
