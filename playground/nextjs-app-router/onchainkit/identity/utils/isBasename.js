const isBasename = username => {
  if (username.endsWith('.base.eth')) {
    return true;
  }
  if (username.endsWith('.basetest.eth')) {
    return true;
  }
  return false;
};
export { isBasename };
//# sourceMappingURL=isBasename.js.map
