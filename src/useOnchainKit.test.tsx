/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { useOnchainKit } from './useOnchainKit';
import { setOnchainKitConfig } from './OnchainKitConfig';

const TestComponent = () => {
  const { schemaId } = useOnchainKit();
  return <div>{schemaId}</div>;
};

describe('useOnchainKit', () => {
  it('should return the correct value', () => {
    const schemaId = '0x123';
    setOnchainKitConfig({ schemaId });
    const { container } = render(<TestComponent />, {
      wrapper: ({ children }) => <div>{children}</div>,
    });
    expect(container).toHaveTextContent(schemaId);
  });
});
