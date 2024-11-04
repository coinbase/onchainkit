function isSwapError(response) {
  return response !== null && typeof response === 'object' && 'error' in response;
}
export { isSwapError };
//# sourceMappingURL=isSwapError.js.map
