/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { useOnchainKit } from './useOnchainKit';

const TestComponent = () => {
  const { schemaId } = useOnchainKit();
  return <div>{schemaId}</div>;
};

describe('useOnchainKit', () => {
  it('throws an error when useOnchainKit is used outside of OnchainKitProvider', () => {
    expect(() => render(<TestComponent />)).toThrow(
      'useOnchainKit must be used within an OnchainKitProvider',
    );
  });
});
