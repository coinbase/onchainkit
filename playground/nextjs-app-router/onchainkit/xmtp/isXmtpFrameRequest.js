function isXmtpFrameRequest( /* biome-ignore lint: code needs to be refactored */
payload) {
  return !!payload && !!payload.untrustedData && !!payload.trustedData && !!payload.clientProtocol?.startsWith('xmtp@');
}
export { isXmtpFrameRequest };
//# sourceMappingURL=isXmtpFrameRequest.js.map
