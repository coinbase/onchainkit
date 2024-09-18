import { render, fireEvent } from '@testing-library/react';
import { act } from 'react';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { QuantitySelector } from './QuantitySelector';
import { pressable } from '../../styles/theme';

describe('QuantitySelector component', () => {
  let mockOnChange: Mock;
  beforeEach(() => {
    mockOnChange = vi.fn();
  });

  it('should render', () => {
    const { getByTestId } = render(<QuantitySelector defaultValue='1' onChange={mockOnChange} placeholder=""/>);

    const quantitySelector = getByTestId('ockQuantitySelector');
    expect(quantitySelector).toBeInTheDocument();
  });

  it('should render disabled', () => {
    const { getByTestId } = render(<QuantitySelector defaultValue='1' onChange={mockOnChange} disabled={true} placeholder=""/>);

    const decrementButton = getByTestId('ockQuantitySelector_decrement');
    const quantitySelectorInput = getByTestId('ockTextInput_Input');
    const incrementButton = getByTestId('ockQuantitySelector_increment');    

    expect(decrementButton).toHaveClass(pressable.disabled);
    expect(quantitySelectorInput).toHaveClass(pressable.disabled);
    expect(incrementButton).toHaveClass(pressable.disabled);
  });

  it('should render default value', () => {
    const { getByTestId } = render(<QuantitySelector defaultValue='1' onChange={mockOnChange} placeholder=""/>);

    const quantitySelectorInput = getByTestId('ockTextInput_Input');
    expect(quantitySelectorInput).toHaveValue('1');
  });

  it('should increment value', () => {
    const { getByTestId } = render(<QuantitySelector defaultValue='1' onChange={mockOnChange} placeholder=""/>);

    const incrementButton = getByTestId('ockQuantitySelector_increment');
    act(() => {
      incrementButton.click();
    })

    const quantitySelectorInput = getByTestId('ockTextInput_Input');
    expect(quantitySelectorInput).toHaveValue('2');
    expect(mockOnChange).toHaveBeenCalledWith('2');
  });

  it('should not increment above maxQuantity', () => {
    const { getByTestId } = render(<QuantitySelector defaultValue='1' onChange={mockOnChange} maxQuantity={1} placeholder=""/>);

    const incrementButton = getByTestId('ockQuantitySelector_increment');
    act(() => {
      incrementButton.click();
    });

    const quantitySelectorInput = getByTestId('ockTextInput_Input');
    expect(quantitySelectorInput).toHaveValue('1');
    expect(mockOnChange).toHaveBeenCalledWith('1');
  })

  it('should decrement value', () => {
    const { getByTestId } = render(<QuantitySelector defaultValue='3' onChange={mockOnChange} placeholder=""/>);

    const decrementButton = getByTestId('ockQuantitySelector_decrement');
    act(() => {
      decrementButton.click();
    });

    const quantitySelectorInput = getByTestId('ockTextInput_Input');
    expect(quantitySelectorInput).toHaveValue('2');
    expect(mockOnChange).toHaveBeenCalledWith('2');
  });

  it('should not decrement below minQuantity', () => {
    const { getByTestId } = render(<QuantitySelector defaultValue='1' onChange={mockOnChange} minQuantity={1} placeholder=""/>);

    const decrementButton = getByTestId('ockQuantitySelector_decrement');
    act(() => {
      decrementButton.click();
    });

    const quantitySelectorInput = getByTestId('ockTextInput_Input');
    expect(quantitySelectorInput).toHaveValue('1');
    expect(mockOnChange).toHaveBeenCalledWith('1');
  });
  
  it('should reset to minQuantity on blur if no value', () => {
    const { getByTestId } = render(<QuantitySelector defaultValue='1' onChange={mockOnChange} minQuantity={1} placeholder=""/>);

    const quantitySelectorInput = getByTestId('ockTextInput_Input');
    act(() => {
      quantitySelectorInput.focus();
      fireEvent.change(quantitySelectorInput, {target: {value: ''}});
      quantitySelectorInput.blur();
    });

    expect(quantitySelectorInput).toHaveValue('1');
    expect(mockOnChange).not.toHaveBeenCalled;
  });

  it('should reset to minQuantity on blur if value less than minimumQuantity', () => {
    const { getByTestId } = render(<QuantitySelector defaultValue='5' onChange={mockOnChange} minQuantity={5} placeholder=""/>);

    const quantitySelectorInput = getByTestId('ockTextInput_Input');
    act(() => {
      quantitySelectorInput.focus();
      fireEvent.change(quantitySelectorInput, {target: {value: '4'}});
      quantitySelectorInput.blur();
    });

    expect(quantitySelectorInput).toHaveValue('5');
    expect(mockOnChange).not.toHaveBeenCalled;
  });

  it('should reset to maxQuantity on blue if value greater than maxQuantity', () => {
    const { getByTestId } = render(<QuantitySelector defaultValue='1' onChange={mockOnChange} maxQuantity={5} placeholder=""/>);

    const quantitySelectorInput = getByTestId('ockTextInput_Input');
    act(() => {
      quantitySelectorInput.focus();
      fireEvent.change(quantitySelectorInput, {target: {value: '6'}});
      quantitySelectorInput.blur();
    });

    expect(quantitySelectorInput).toHaveValue('5');
    expect(mockOnChange).not.toHaveBeenCalled;
  })
});
