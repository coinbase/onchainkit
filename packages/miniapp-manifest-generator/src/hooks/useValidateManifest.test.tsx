import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useValidateManifest } from './useValidateManifest';
import { verifyMessage } from 'viem';

const mockReadContract = vi.fn();
const mockClient = {
  readContract: mockReadContract,
};

const mockAccountAssociation = {
  header: 'eyJmaWQiOjEyMywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweGFiYzEyMyJ9', // {"fid":123,"type":"custody","key":"0xabc123"}
  payload: 'eyJkb21haW4iOiJleGFtcGxlLmNvbSJ9', // {"domain":"example.com"}
  signature:
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // mock signature in base64url format
  domain: 'example.com',
};

vi.mock('viem', () => ({
  verifyMessage: vi.fn(),
  createPublicClient: vi.fn(() => mockClient),
  http: vi.fn(),
}));

describe('useValidateManifest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate a valid manifest', async () => {
    vi.mocked(verifyMessage).mockResolvedValue(true);
    mockReadContract.mockResolvedValue('0xabc123');

    const { result } = renderHook(() => useValidateManifest());

    await expect(result.current(mockAccountAssociation)).resolves.not.toThrow();
  });

  it('should return manifest details', async () => {
    vi.mocked(verifyMessage).mockResolvedValue(true);
    mockReadContract.mockResolvedValue('0xabc123');

    const { result } = renderHook(() => useValidateManifest());

    await expect(result.current(mockAccountAssociation)).resolves.toEqual({
      fid: 123,
      type: 'custody',
      key: '0xabc123',
      custodyAddress: '0xabc123',
      domain: 'example.com',
    });
  });

  it('should throw error for invalid signature', async () => {
    vi.mocked(verifyMessage).mockResolvedValue(false);

    const { result } = renderHook(() => useValidateManifest());

    await expect(result.current(mockAccountAssociation)).rejects.toThrow(
      'Invalid signature',
    );
  });

  it('should throw error for non-custody type', async () => {
    const invalidTypeAssociation = {
      ...mockAccountAssociation,
      header:
        'eyJmaWQiOjEyMywidHlwZSI6Im5vdGN1c3RvZHkiLCJrZXkiOiIweGFiYzEyMyJ9', // type: "notcustody"
    };

    const { result } = renderHook(() => useValidateManifest());

    await expect(result.current(invalidTypeAssociation)).rejects.toThrow(
      'Invalid type: type must be "custody"',
    );
  });

  it('should throw error for mismatched custody address', async () => {
    vi.mocked(verifyMessage).mockResolvedValue(true);
    mockReadContract.mockResolvedValue('0xdifferentAddress');

    const { result } = renderHook(() => useValidateManifest());

    await expect(result.current(mockAccountAssociation)).rejects.toThrow(
      'Invalid custody address',
    );
  });
});
