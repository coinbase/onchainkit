import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders the children', () => {
    render(<Tooltip content="Test Content" />);
    expect(screen.getByTestId('ockBuyApplePayInfo')).toBeInTheDocument();
  });

  it('shows the content on mouse enter', () => {
    render(<Tooltip content="Test Content" />);
    const triggerElement = screen.getByTestId('ockBuyApplePayInfo');

    fireEvent.mouseEnter(triggerElement);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('hides the content on mouse leave', () => {
    render(<Tooltip content="Test Content" />);
    const triggerElement = screen.getByTestId('ockBuyApplePayInfo');

    fireEvent.mouseEnter(triggerElement);
    fireEvent.mouseLeave(triggerElement);

    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('renders custom children if provided', () => {
    const CustomChild = <div>Custom Child</div>;
    render(<Tooltip content="Test Content">{CustomChild}</Tooltip>);

    expect(screen.getByText('Custom Child')).toBeInTheDocument();
  });
});
