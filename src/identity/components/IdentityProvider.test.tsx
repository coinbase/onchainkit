/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, renderHook } from '@testing-library/react';
import { Address } from 'viem';
import { IdentityProvider, useIdentityContext } from './IdentityProvider';

describe('IdentityProvider', () => {
  it('provides context values from props', () => {
    const address: Address = '0x1234567890abcdef1234567890abcdef12345678';
    const schemaId: Address = '0xabcdefabcdefabcdefabcdefabcdefabcdef';

    render(
      <IdentityProvider address={address} schemaId={schemaId}>
        <div />
      </IdentityProvider>,
    );

    const { result } = renderHook(() => useIdentityContext(), {
      wrapper: IdentityProvider,
    });
    expect(result.current.address).toEqual(address);
    expect(result.current.schemaId).toEqual(schemaId);
  });

  it('should return default context when no props are passed', () => {
    render(
      <IdentityProvider>
        <div />
      </IdentityProvider>,
    );

    const { result } = renderHook(() => useIdentityContext(), {
      wrapper: IdentityProvider,
    });
    expect(result.current.address).toEqual('');
    expect(result.current.schemaId).toEqual(undefined);
  });
});
