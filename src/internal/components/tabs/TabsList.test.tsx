import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TabsList } from './TabsList';

describe('TabsList', () => {
  it('renders children correctly', () => {
    render(
      <TabsList>
        <div>Tab 1</div>
        <div>Tab 2</div>
      </TabsList>,
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  it('applies default styles', () => {
    render(
      <TabsList>
        <div>Tab 1</div>
      </TabsList>,
    );

    const tabsList = screen.getByText('Tab 1').parentElement;
    expect(tabsList).toHaveClass('flex overflow-hidden');
  });

  it('applies custom className', () => {
    render(
      <TabsList className="custom-class">
        <div>Tab 1</div>
      </TabsList>,
    );

    const tabsList = screen.getByText('Tab 1').parentElement;
    expect(tabsList).toHaveClass('custom-class');
  });

  it('merges default and custom className', () => {
    render(
      <TabsList className="custom-class">
        <div>Tab 1</div>
      </TabsList>,
    );

    const tabsList = screen.getByText('Tab 1').parentElement;
    expect(tabsList).toHaveClass('flex overflow-hidden custom-class');
  });
});
