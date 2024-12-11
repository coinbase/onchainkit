export const isBasename = (username: string) => {
  if (username.endsWith('.base.eth')) {
    return true;
  }
  if (username.endsWith('.basetest.eth')) {
    return true;
  }
  return false;
};
