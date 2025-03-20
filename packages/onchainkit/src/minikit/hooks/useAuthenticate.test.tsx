import sdk from '@farcaster/frame-sdk';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthenticate } from './useAuthenticate';

const signInMock = {
  message:
    'test.frames.app wants you to sign in with your Ethereum account:\n0x58b5513c3999632542332e4e2eD0298EC1fF1831',
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

    vi.clearAllMocks();
  });

  it('should return a function', () => {
    const { result } = renderHook(() => useAuthenticate());
    expect(typeof result.current).toBe('function');
  });

  it('should call sdk.actions.signIn when executed', async () => {
    const { result } = renderHook(() => useAuthenticate());

    await act(async () => {
      await result.current();
    });

    expect(sdk.actions.signIn).toHaveBeenCalled();
  });

  it('should update client context with auth details on success', async () => {
    const { result } = renderHook(() => useAuthenticate());

    const response = await result.current();

    expect(response).toBe(signInMock);
  });

  it('should return false if authentication fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    (sdk.actions.signIn as Mock).mockRejectedValue(new Error('Auth failed'));

    const { result } = renderHook(() => useAuthenticate());
    const response = await result.current();

    expect(response).toBe(false);
  });

  it('should throw an error if the domain of the message does not match the passed in domain', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    const { result } = renderHook(() =>
      useAuthenticate('https://other.frames.app'),
    );
    const response = await result.current();

    expect(response).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(new Error('Domain mismatch'));
  });
});
