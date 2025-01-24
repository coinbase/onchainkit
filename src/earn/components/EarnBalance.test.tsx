import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EarnBalance } from './EarnBalance';

describe('EarnBalance', () => {
  it('renders the title and subtitle correctly', () => {
    render(
      <EarnBalance
        title="Test Title"
        subtitle="Test Subtitle"
        showAction={false}
        onActionPress={() => {}}
      />,
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders the action button when showAction is true', () => {
    render(
      <EarnBalance
        title="Test Title"
        subtitle="Test Subtitle"
        showAction={true}
        onActionPress={() => {}}
      />,
    );

    expect(screen.getByText('Use max')).toBeInTheDocument();
  });

  it('does not render the action button when showAction is false', () => {
    render(
      <EarnBalance
        title="Test Title"
        subtitle="Test Subtitle"
        showAction={false}
        onActionPress={() => {}}
      />,
    );

    expect(screen.queryByText('Use max')).not.toBeInTheDocument();
  });

  it('calls onActionPress when the action button is clicked', () => {
    const mockOnActionPress = vi.fn();

    render(
      <EarnBalance
        title="Test Title"
        subtitle="Test Subtitle"
        showAction={true}
        onActionPress={mockOnActionPress}
      />,
    );

    const actionButton = screen.getByText('Use max');
    fireEvent.click(actionButton);

    expect(mockOnActionPress).toHaveBeenCalledTimes(1);
  });

  it('calls onActionPress when the button is focused and Enter is pressed', () => {
    const mockOnActionPress = vi.fn();
    render(
      <EarnBalance
        title="Test Title"
        subtitle="Test Subtitle"
        showAction={true}
        onActionPress={mockOnActionPress}
      />,
    );
    const button = screen.getByText('Use max');
    button.focus();
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(mockOnActionPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onActionPress for keys other than Enter', () => {
    const mockOnActionPress = vi.fn();
    render(
      <EarnBalance
        title="Test Title"
        subtitle="Test Subtitle"
        showAction={true}
        onActionPress={mockOnActionPress}
      />,
    );
    const button = screen.getByText('Use max');
    button.focus();
    fireEvent.keyDown(button, { key: 'Space', code: 'Space', charCode: 32 });
    expect(mockOnActionPress).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';

    render(
      <EarnBalance
        title="Test Title"
        subtitle="Test Subtitle"
        className={customClass}
        showAction={false}
        onActionPress={() => {}}
      />,
    );

    const container = screen.getByTestId('ockEarnBalance');
    expect(container).toHaveClass(customClass);
  });
});
