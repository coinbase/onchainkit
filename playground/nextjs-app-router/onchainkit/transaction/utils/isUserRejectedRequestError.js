function isUserRejectedRequestError(err) {
  if (err?.cause?.name === 'UserRejectedRequestError') {
    return true;
  }
  if (err?.shortMessage?.includes('User rejected the request.')) {
    return true;
  }
  return false;
}
export { isUserRejectedRequestError };
//# sourceMappingURL=isUserRejectedRequestError.js.map
