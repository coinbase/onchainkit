/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { EASSchemaUid } from './identity/types';
import { OnchainKitProvider } from './OnchainKitProvider';
import { useOnchainKit } from './useOnchainKit';

const TestComponent = () => {
  const { identity } = useOnchainKit();
  return <div>{identity.eas.schemaId}</div>;
};

describe('OnchainKitProvider', () => {
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
});
