import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ScaledTextInput } from './ScaledTextInput';

function renderComponent(value: string) {
  return render(
    <ScaledTextInput
      className=""
      delayMs={0}
      onChange={vi.fn()}
      placeholder="placeholder"
      value={value}
      setValue={vi.fn()}
    />,
  );
}

describe('ScaledTextInput component', () => {
  afterEach(() => {
    // reset offsetWidths
    Object.defineProperty(HTMLDivElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 0,
    });
    Object.defineProperty(HTMLSpanElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 0,
    });
  });

  it('should render', () => {
    const { getByDisplayValue } = renderComponent('1.0202');
    const inputElement = getByDisplayValue('1.0202');
    expect(inputElement).toBeDefined();
  });

  it('should render with an empty value', () => {
    const { getByTestId } = renderComponent('');
    const inputElement = getByTestId('scaled-text-input-container');
    expect(inputElement).toBeDefined();
  });

  it('should show full size for short values', () => {
    Object.defineProperty(HTMLDivElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(HTMLSpanElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 50,
    });

    const { getByTestId } = renderComponent('1.0202');

    expect(
      getByTestId('scaled-text-input-container').getAttribute('style'),
    ).toEqual('transform: scale(1); width: 100%;');
  });

  it('should show scaled for large values', () => {
    Object.defineProperty(HTMLDivElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(HTMLSpanElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 200,
    });

    const { getByTestId } = renderComponent('1.0202');

    expect(
      getByTestId('scaled-text-input-container').getAttribute('style'),
    ).toEqual('transform: scale(0.5); width: 200%;');
  });
});
