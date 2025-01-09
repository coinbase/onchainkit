import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PressableIcon } from './PressableIcon';

describe('PressableIcon', () => {
  it('renders children correctly', () => {
    render(
      <PressableIcon>
        <span data-testid="test-child">Icon</span>
      </PressableIcon>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(
      <PressableIcon>
        <span>Icon</span>
      </PressableIcon>,
    );

    const container = screen.getByText('Icon').parentElement;
    expect(container).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('merges custom className with default classes', () => {
    const customClass = 'custom-class';
    render(
      <PressableIcon className={customClass}>
        <span>Icon</span>
      </PressableIcon>,
    );

    const button = screen.getByTestId('ockPressableIconButton');
    expect(button).toHaveClass(
      'flex',
      'items-center',
      'justify-center',
      customClass,
    );
  });

  it('applies aria-label to button', () => {
    const ariaLabel = 'test-aria-label';
    render(
      <PressableIcon ariaLabel={ariaLabel}>
        <span>Icon</span>
      </PressableIcon>,
    );

    const button = screen.getByTestId('ockPressableIconButton');
    expect(button).toHaveAttribute('aria-label', ariaLabel);
  });
});
