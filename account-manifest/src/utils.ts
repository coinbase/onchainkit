export const toBase64Url = (str: string) => {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const validateUrl = (domain: string) => {
  const urlRegex =
    /^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*(?: [\w.-]*)*)*\/?$/;
  return domain.length === 0 || (domain.length > 0 && urlRegex.test(domain));
};
