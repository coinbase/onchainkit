import { isXmtpFrameRequest } from './isXmtpFrameRequest';

describe('isXmtpFrameRequest', () => {
  it('should return true for requests with the correct client protocol', () => {
    expect(
      isXmtpFrameRequest({
        clientProtocol: 'xmtp@2024-02-09',
        untrustedData: {},
        trustedData: {},
      }),
    ).toBe(true);
  });

  it('should return false for farcaster requests', () => {
    expect(
      isXmtpFrameRequest({
        untrustedData: {},
        trustedData: {},
      }),
    ).toBe(false);
  });

  it('should return false for other client protocols', () => {
    expect(
      isXmtpFrameRequest({
        clientProtocol: 'lens@v1',
        untrustedData: {},
        trustedData: {},
      }),
    );
  });

  it('should return false for malformed requests', () => {
    expect(
      isXmtpFrameRequest({
        clientProtocol: 'xmtp@2024-02-09',
      }),
    ).toBe(false);
  });
});
