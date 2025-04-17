function getVersion() {
  if (typeof __OCK_VERSION__ === 'undefined') {
    throw new Error('__OCK_VERSION__ is not defined');
  }
  return __OCK_VERSION__;
}

export const version = getVersion();
