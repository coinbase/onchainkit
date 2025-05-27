import sdk from '@farcaster/frame-sdk';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { parseSignInMessage, useAuthenticate } from './useAuthenticate';
import { useMiniKit } from './useMiniKit';

const signInMock = {
  message:
    'test.frames.app wants you to sign in with your Ethereum account:\n0x123\n\nFarcaster Auth\n\nURI: https://test.frames.app/\nVersion: 1\nChain ID: 10\nNonce: z72pa2nz\nIssued At: 2025-03-25T15:45:27.312Z\nResources:\n- farcaster://fid/123456',
  signature: '0x123',
};

vi.mock('@farcaster/frame-sdk', () => ({
  default: {
    actions: {
      signIn: vi.fn(),
    },
  },
}));

vi.mock('./useMiniKit', () => ({
  useMiniKit: vi.fn(),
}));

describe('useAuthenticate', () => {
  beforeEach(() => {
    (sdk.actions.signIn as Mock).mockResolvedValue(signInMock);
    (useMiniKit as Mock).mockReturnValue({
      context: {
        client: {
          clientFid: 123456,
        },
      },
    });

    vi.clearAllMocks();
  });

  it('should return a function', () => {
    const { result } = renderHook(() => useAuthenticate());
    expect(typeof result.current.signIn).toBe('function');
  });

  it('should call sdk.actions.signIn when executed', async () => {
    const { result } = renderHook(() => useAuthenticate());

    await act(async () => {
      await result.current.signIn({ nonce: 'z72pa2nz' });
    });

    expect(sdk.actions.signIn).toHaveBeenCalled();
  });

  it('should return the auth details on success', async () => {
    const { result } = renderHook(() => useAuthenticate());

    const response = await result.current.signIn({ nonce: 'z72pa2nz' });

    expect(response).toBe(signInMock);
  });

  it('should return false if authentication fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    (sdk.actions.signIn as Mock).mockRejectedValue(new Error('Auth failed'));

    const { result } = renderHook(() => useAuthenticate());
    const response = await result.current.signIn();

    expect(response).toBe(false);
  });

  it('should throw an error if the domain of the message does not match the passed in domain', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    const { result } = renderHook(() =>
      useAuthenticate('https://other.frames.app'),
    );
    const response = await result.current.signIn({ nonce: 'z72pa2nz' });

    expect(response).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(new Error('Domain mismatch'));
  });

  it('should throw an error if the nonce of the message does not match the passed in nonce', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    const { result } = renderHook(() => useAuthenticate());
    const response = await result.current.signIn({ nonce: '123' });

    expect(response).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(new Error('Nonce mismatch'));
  });

  it('should throw an error if the fid of the message does not match the users fid', async () => {
    (useMiniKit as Mock).mockReturnValue({
      context: {
        user: {
          fid: 123,
        },
      },
    });

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    const { result } = renderHook(() => useAuthenticate());
    const response = await result.current.signIn({ nonce: 'z72pa2nz' });

    expect(response).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(new Error('Fid mismatch'));
  });

  it('should skip validation if skipValidation is true', async () => {
    (useMiniKit as Mock).mockReturnValue({
      context: {
        user: {
          fid: 123,
        },
      },
    });

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    const { result } = renderHook(() => useAuthenticate(undefined, true));
    const response = await result.current.signIn({
      nonce: 'z72pa2nz',
    });

    expect(response).toBe(signInMock);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('should parse the message correctly', () => {
    const message = parseSignInMessage(signInMock.message);

    expect(message).toEqual({
      domain: 'test.frames.app',
      address: '0x123',
      chainID: '10',
      issuedAt: '2025-03-25T15:45:27.312Z',
      nonce: 'z72pa2nz',
      resources: ['farcaster://fid/123456'],
      uri: 'https://test.frames.app/',
      version: '1',
    });
  });
});
