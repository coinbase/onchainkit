import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useValidateManifest } from './useValidateManifest';

const mockReadContract = vi.fn();
const mockVerifyMessage = vi.fn();
const mockClient = {
  readContract: mockReadContract,
  verifyMessage: mockVerifyMessage,
};

const mockAccountAssociation = {
  header: 'eyJmaWQiOjEyMywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweGFiYzEyMyJ9', // {"fid":123,"type":"custody","key":"0xabc123"}
  payload: 'eyJkb21haW4iOiJleGFtcGxlLmNvbSJ9', // {"domain":"example.com"}
  signature:
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // mock signature in base64url format
  domain: 'example.com',
};

const authAccountAssociation = {
  ...mockAccountAssociation,
  header: 'eyJmaWQiOjEyMywidHlwZSI6ImF1dGgiLCJrZXkiOiIweGFiYzEyMyJ9', // {"fid":123,"type":"auth","key":"0xabc123"}
};

vi.mock('viem', () => ({
  createPublicClient: vi.fn(() => mockClient),
  http: vi.fn(),
}));

function mockHubVerifications(addresses: string[]) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      messages: addresses.map((address) => ({
        data: { verificationAddAddressBody: { address } },
      })),
    }),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('useValidateManifest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should validate a valid manifest', async () => {
    mockVerifyMessage.mockResolvedValue(true);
    mockReadContract.mockResolvedValue('0xabc123');

    const { result } = renderHook(() =>
      useValidateManifest({ accountAssociation: mockAccountAssociation }),
    );

    await expect(result.current()).resolves.not.toThrow();
  });

  it('should throw error for invalid signature', async () => {
    mockVerifyMessage.mockResolvedValue(false);

    const { result } = renderHook(() =>
      useValidateManifest({ accountAssociation: mockAccountAssociation }),
    );

    await expect(result.current()).rejects.toThrow('Invalid signature');
  });

  it('should throw error for a type that is neither custody nor auth', async () => {
    const invalidTypeAssociation = {
      ...mockAccountAssociation,
      header:
        'eyJmaWQiOjEyMywidHlwZSI6Im5vdGN1c3RvZHkiLCJrZXkiOiIweGFiYzEyMyJ9', // type: "notcustody"
    };

    const { result } = renderHook(() =>
      useValidateManifest({ accountAssociation: invalidTypeAssociation }),
    );

    await expect(result.current()).rejects.toThrow(
      'Invalid type: type must be "custody" or "auth"',
    );
  });

  it('should throw error for mismatched custody address', async () => {
    mockVerifyMessage.mockResolvedValue(true);
    mockReadContract.mockResolvedValue('0xdifferentAddress');

    const { result } = renderHook(() =>
      useValidateManifest({ accountAssociation: mockAccountAssociation }),
    );

    await expect(result.current()).rejects.toThrow('Invalid custody address');
  });

  it('should do nothing when accountAssociation is null', async () => {
    const { result } = renderHook(() =>
      useValidateManifest({ accountAssociation: null }),
    );

    await expect(result.current()).resolves.toBeUndefined();
  });

  it('should accept an auth address that the FID has verified', async () => {
    mockVerifyMessage.mockResolvedValue(true);
    mockReadContract.mockResolvedValue('0xsomeOtherCustodyAddress');
    const fetchMock = mockHubVerifications(['0xABC123']);

    const { result } = renderHook(() =>
      useValidateManifest({ accountAssociation: authAccountAssociation }),
    );

    await expect(result.current()).resolves.not.toThrow();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('verificationsByFid?fid=123'),
    );
  });

  it('should reject an auth address the FID has not verified', async () => {
    mockVerifyMessage.mockResolvedValue(true);
    mockReadContract.mockResolvedValue('0xsomeOtherCustodyAddress');
    mockHubVerifications(['0xsomeoneElse']);

    const { result } = renderHook(() =>
      useValidateManifest({ accountAssociation: authAccountAssociation }),
    );

    await expect(result.current()).rejects.toThrow(
      'Invalid auth address: not verified for this FID',
    );
  });

  it('should accept an auth-typed association signed by the custody address', async () => {
    // Mislabelled, but the key really does belong to the FID, so the domain is bound.
    mockVerifyMessage.mockResolvedValue(true);
    mockReadContract.mockResolvedValue('0xabc123');
    const fetchMock = mockHubVerifications([]);

    const { result } = renderHook(() =>
      useValidateManifest({ accountAssociation: authAccountAssociation }),
    );

    await expect(result.current()).resolves.not.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should surface a hub failure rather than silently passing', async () => {
    mockVerifyMessage.mockResolvedValue(true);
    mockReadContract.mockResolvedValue('0xsomeOtherCustodyAddress');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));

    const { result } = renderHook(() =>
      useValidateManifest({ accountAssociation: authAccountAssociation }),
    );

    await expect(result.current()).rejects.toThrow(
      'Could not reach a Farcaster hub',
    );
  });
});
