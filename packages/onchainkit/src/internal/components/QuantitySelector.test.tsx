import { fireEvent, render } from '@testing-library/react';
import { act } from 'react';
import '@testing-library/jest-dom';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { pressable } from '../../styles/theme';
import { DELAY_MS, QuantitySelector } from './QuantitySelector';

describe('QuantitySelector component', () => {
  let mockOnChange: Mock;
  beforeEach(() => {
    vi.useFakeTimers();
    mockOnChange = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render', () => {
    const { getByTestId } = render(
      <QuantitySelector
        minQuantity={1}
        onChange={mockOnChange}
        placeholder=""
      />,
    );

    const input = getByTestId('ockQuantitySelector');
    expect(input).toBeInTheDocument();
  });

  it('should render disabled', () => {
    const { getByTestId } = render(
      <QuantitySelector
        minQuantity={1}
        onChange={mockOnChange}
        disabled={true}
        placeholder=""
      />,
    );

    const decrementButton = getByTestId('ockQuantitySelector_decrement');
    const input = getByTestId('ockTextInput_Input');
    const incrementButton = getByTestId('ockQuantitySelector_increment');

    expect(decrementButton).toHaveClass(pressable.disabled);
    expect(input).toHaveClass(pressable.disabled);
    expect(incrementButton).toHaveClass(pressable.disabled);
  });

  it('should render default value', () => {
    const { getByTestId } = render(
      <QuantitySelector
        minQuantity={1}
        onChange={mockOnChange}
        placeholder=""
      />,
    );

    const input = getByTestId('ockTextInput_Input');
    expect(input).toHaveValue('1');
  });

  it('should increment value', () => {
    const { getByTestId } = render(
      <QuantitySelector
        minQuantity={1}
        onChange={mockOnChange}
        placeholder=""
      />,
    );

    const incrementButton = getByTestId('ockQuantitySelector_increment');
    act(() => {
      incrementButton.click();
    });

    const input = getByTestId('ockTextInput_Input');
    expect(input).toHaveValue('2');
    expect(mockOnChange).toHaveBeenCalledWith('2');
  });

  it('should not increment above maxQuantity', () => {
    const { getByTestId } = render(
      <QuantitySelector
        minQuantity={1}
        onChange={mockOnChange}
        maxQuantity={1}
        placeholder=""
      />,
    );

    const incrementButton = getByTestId('ockQuantitySelector_increment');
    act(() => {
      incrementButton.click();
    });

    const input = getByTestId('ockTextInput_Input');
    expect(input).toHaveValue('1');
    expect(mockOnChange).toHaveBeenCalledWith('1');
  });

  it('should decrement value', () => {
    const { getByTestId } = render(
      <QuantitySelector
        minQuantity={1}
        onChange={mockOnChange}
        placeholder=""
      />,
    );

    const input = getByTestId('ockTextInput_Input');
    const incrementButton = getByTestId('ockQuantitySelector_increment');
    const decrementButton = getByTestId('ockQuantitySelector_decrement');

    act(() => {
      incrementButton.click();
    });

    expect(input).toHaveValue('2');

    act(() => {
      decrementButton.click();
    });

    expect(input).toHaveValue('1');
    expect(mockOnChange).toHaveBeenCalledWith('1');
  });

  it('should not decrement below minQuantity', () => {
    const { getByTestId } = render(
      <QuantitySelector
        minQuantity={1}
        onChange={mockOnChange}
        placeholder=""
      />,
    );

    const decrementButton = getByTestId('ockQuantitySelector_decrement');
    act(() => {
      decrementButton.click();
    });

    const input = getByTestId('ockTextInput_Input');
    expect(input).toHaveValue('1');
    expect(mockOnChange).toHaveBeenCalledWith('1');
  });

  it('should not fire onChange on empty string', () => {
    const { getByTestId } = render(
      <QuantitySelector
        onChange={mockOnChange}
        minQuantity={1}
        placeholder=""
      />,
    );

    const input = getByTestId('ockTextInput_Input');
    act(() => {
      fireEvent.change(input, { target: { value: '' } });
    });

    vi.advanceTimersByTime(DELAY_MS);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should not fire onChange if value is not a number', () => {
    const { getByTestId } = render(
      <QuantitySelector
        onChange={mockOnChange}
        minQuantity={1}
        placeholder=""
      />,
    );

    const input = getByTestId('ockTextInput_Input');
    act(() => {
      fireEvent.change(input, { target: { value: 'a' } });
    });

    vi.advanceTimersByTime(DELAY_MS);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should not fire onChange if value < minQuantity', () => {
    const { getByTestId } = render(
      <QuantitySelector
        onChange={mockOnChange}
        minQuantity={5}
        placeholder=""
      />,
    );

    const input = getByTestId('ockTextInput_Input');
    act(() => {
      fireEvent.change(input, { target: { value: '4' } });
    });

    vi.advanceTimersByTime(DELAY_MS);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should not fire onChange if value > maxQuantity', () => {
    const { getByTestId } = render(
      <QuantitySelector
        onChange={mockOnChange}
        maxQuantity={5}
        placeholder=""
      />,
    );

    const input = getByTestId('ockTextInput_Input');
    act(() => {
      fireEvent.change(input, { target: { value: '6' } });
    });

    vi.advanceTimersByTime(DELAY_MS);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should fire onChange on valid value', () => {
    const { getByTestId } = render(
      <QuantitySelector
        onChange={mockOnChange}
        minQuantity={1}
        placeholder=""
      />,
    );

    const input = getByTestId('ockTextInput_Input');
    act(() => {
      fireEvent.change(input, { target: { value: '2' } });
    });

    vi.advanceTimersByTime(DELAY_MS);

    expect(mockOnChange).toHaveBeenCalledWith('2');
  });

  it('should reset to minQuantity on blur if no value', () => {
    const { getByTestId } = render(
      <QuantitySelector
        onChange={mockOnChange}
        minQuantity={1}
        placeholder=""
      />,
    );

    const input = getByTestId('ockTextInput_Input');
    act(() => {
      input.focus();
      fireEvent.change(input, { target: { value: '' } });
      input.blur();
    });

    expect(input).toHaveValue('1');
    expect(mockOnChange).toHaveBeenCalledWith('1');
  });
});
