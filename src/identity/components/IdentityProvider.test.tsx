/**
 * @vitest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, renderHook } from '@testing-library/react';
import type { Address, Chain } from 'viem';
import { IdentityProvider, useIdentityContext } from './IdentityProvider';
import { baseSepolia } from 'viem/chains';

describe('IdentityProvider', () => {
  it('provides context values from props', () => {
    const address: Address = '0x1234567890abcdef1234567890abcdef12345678';
    const schemaId: Address = '0xabcdefabcdefabcdefabcdefabcdefabcdef';
    const chain: Chain = baseSepolia;

    const { result } = renderHook(() => useIdentityContext(), {
      wrapper: ({ children }) => (
        <IdentityProvider address={address} schemaId={schemaId} chain={chain}>
          {children}
        </IdentityProvider>
      ),
    });
    expect(result.current.address).toEqual(address);
    expect(result.current.schemaId).toEqual(schemaId);
    expect(result.current.chain.id).toEqual(chain.id);
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
    expect(result.current.chain.id).toEqual(84532); // defaults to base
  });
});
