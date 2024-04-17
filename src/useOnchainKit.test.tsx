/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { OnchainKitProvider, useOnchainKit } from './useOnchainKit'; // Adjust the import path as necessary
import { EASSchemaUid } from './identity/types';

import '@testing-library/jest-dom';

// Mock the necessary imports
jest.mock('./identity/checkHashLength', () => ({
  checkHashLength: jest.fn().mockImplementation((id) => id.startsWith('0x') && id.length === 66),
}));

// Helper component to test useOnchainKit hook
const TestComponent = () => {
  const { identity } = useOnchainKit();
  return <div>{identity.eas.schemaId}</div>;
};

describe('OnchainKitProvider and useOnchainKit', () => {
  it('provides the context value correctly', async () => {
    const schemaId: EASSchemaUid = `0x${'1'.repeat(64)}`;

    render(
      <OnchainKitProvider identity={{ easConfig: { schemaId } }}>
        <TestComponent />
      </OnchainKitProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(schemaId)).toBeInTheDocument();
    });
  });

  it('throws an error if schemaId does not meet the required length', () => {
    expect(() =>
      render(
        <OnchainKitProvider identity={{ easConfig: { schemaId: '0x123' } }}>
          <TestComponent />
        </OnchainKitProvider>,
      ),
    ).toThrow('EAS schemaId must be 64 characters prefixed with "0x"');
  });

  it('throws an error when useOnchainKit is used outside of OnchainKitProvider', () => {
    expect(() => render(<TestComponent />)).toThrow(
      'useIdentity must be used within an OnchainKitProvider',
    );
  });
});
