import '@testing-library/jest-dom';
import { act } from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import {
  NftQuantityProvider,
  useNftQuantityContext,
} from './NftQuantityProvider';

const TestComponent = () => {
  const { quantity, setQuantity } = useNftQuantityContext();
  return (
    <div>
      <span data-testid="quantity">{quantity}</span>
      <button onClick={() => setQuantity('5')}>Set Quantity to 5</button>
    </div>
  );
};

describe('NftQuantityProvider', () => {
  it('should provide the default quantity value', () => {
    const { getByTestId } = render(
      <NftQuantityProvider>
        <TestComponent />
      </NftQuantityProvider>,
    );

    const quantityElement = getByTestId('quantity');
    expect(quantityElement).toHaveTextContent('1');
  });

  it('should update the quantity value', () => {
    const { getByText, getByTestId } = render(
      <NftQuantityProvider>
        <TestComponent />
      </NftQuantityProvider>,
    );

    const button = getByText('Set Quantity to 5');
    act(() => {
      button.click();
    });

    const quantityElement = getByTestId('quantity');
    expect(quantityElement).toHaveTextContent('5');
  });

  it('should throw an error when used outside of NftQuantityProvider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useNftQuantityContext must be used within an NftMint component',
    );

    consoleError.mockRestore();
  });
});
