export function isApplePaySupported() {
  return (
    /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (/Safari/.test(navigator.userAgent) &&
      !/Chrome/.test(navigator.userAgent) &&
      !/Edg/.test(navigator.userAgent))
  );
}
