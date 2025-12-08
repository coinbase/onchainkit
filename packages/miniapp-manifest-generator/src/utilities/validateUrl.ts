export const validateUrl = (domain: string) => {
  const urlRegex =
    /^https:\/\/([\da-z.-]+)\.([a-z.]{2,12})(\/[\w.-]*(?: [\w.-]*)*)*\/?$/;
  return domain.length === 0 || (domain.length > 0 && urlRegex.test(domain));
};
