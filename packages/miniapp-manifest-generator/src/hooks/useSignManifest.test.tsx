import { describe, it, expect, vi, Mock, afterEach } from 'vitest';
import { act } from 'react';
import { renderHook } from '@testing-library/react';
import { useSignManifest } from './useSignManifest';
import { useSignMessage } from 'wagmi';

const mockDomain = 'https://example.com';
const mockFid = 123;
const mockAddress = '0x1234567890123456789012345678901234567890';
const mockOnSigned = vi.fn();

vi.mock('wagmi', () => ({
  useSignMessage: vi.fn(),
}));

describe('useSignManifest', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should generate manifest', async () => {
    const mockSignMessageData = '0x1234567890abcdef';
    const mockSignMessage = vi.fn();
    (vi.mocked(useSignMessage) as Mock).mockReturnValue({
      signMessage: mockSignMessage,
      isPending: false,
      error: null,
      data: mockSignMessageData,
    });

    const { result } = renderHook(() =>
      useSignManifest({
        domain: mockDomain,
        fid: mockFid,
        address: mockAddress,
        onSigned: mockOnSigned,
      }),
    );

    await act(async () => {
      await result.current.generateAccountAssociation();
    });

    expect(mockOnSigned).toHaveBeenCalledWith({
      signature: 'MHgxMjM0NTY3ODkwYWJjZGVm',
      header:
        'eyJmaWQiOjEyMywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAifQ',
      payload: 'eyJkb21haW4iOiJleGFtcGxlLmNvbSJ9',
      domain: 'https://example.com',
    });
  });

  it('should not generate manifest when required fields are missing', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const mockSignMessage = vi.fn();
    (vi.mocked(useSignMessage) as Mock).mockReturnValue({
      signMessage: mockSignMessage,
      isPending: false,
      error: null,
      data: null,
    });

    const { result } = renderHook(() =>
      useSignManifest({
        domain: '',
        fid: null,
        address: undefined,
        onSigned: mockOnSigned,
      }),
    );

    await act(async () => {
      await result.current.generateAccountAssociation();
    });

    expect(mockSignMessage).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Domain, FID and wallet connection are required',
    );
    consoleErrorSpy.mockRestore();
  });

  it('should handle errors from signMessage', async () => {
    const mockError = new Error('Failed to sign message');
    const mockSignMessage = vi.fn();
    (vi.mocked(useSignMessage) as Mock).mockReturnValue({
      signMessage: mockSignMessage,
      isPending: false,
      error: mockError,
      data: null,
    });

    const { result } = renderHook(() =>
      useSignManifest({
        domain: mockDomain,
        fid: mockFid,
        address: mockAddress,
        onSigned: mockOnSigned,
      }),
    );

    await act(async () => {
      await result.current.generateAccountAssociation();
    });

    expect(mockSignMessage).toHaveBeenCalled();
    expect(mockOnSigned).not.toHaveBeenCalled();
    expect(result.current.error).toBe(mockError);
  });

  it('should show pending state while signing', async () => {
    const mockSignMessage = vi.fn();
    (vi.mocked(useSignMessage) as Mock).mockReturnValue({
      signMessage: mockSignMessage,
      isPending: true,
      error: null,
      data: null,
    });

    const { result } = renderHook(() =>
      useSignManifest({
        domain: mockDomain,
        fid: mockFid,
        address: mockAddress,
        onSigned: mockOnSigned,
      }),
    );

    await act(async () => {
      await result.current.generateAccountAssociation();
    });

    expect(mockSignMessage).toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
  });
});
