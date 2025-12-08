export const toBase64Url = (str: string) => {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const fromBase64Url = (str: string) => {
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
};
