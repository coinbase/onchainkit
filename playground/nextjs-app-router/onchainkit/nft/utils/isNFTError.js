function isNFTError(response) {
  return response !== null && typeof response === 'object' && 'error' in response;
}
export { isNFTError };
//# sourceMappingURL=isNFTError.js.map
