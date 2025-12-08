export function IsValidIpfsUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const isValidIpfsUrl = parsedUrl.protocol === 'ipfs:';
    return isValidIpfsUrl;
  } catch {
    return false;
  }
}

/**
 * Converts an IPFS URL to a standardized HTTPS URL using a public IPFS gateway.
 *
 * @param url The original URL
 * @returns https:// URL for the media
 * @link https://docs.ipfs.tech/how-to/address-ipfs-on-web/ - for more details.
 */
export function convertIpfsToHttps(url?: string): string | undefined {
  if (!url) {
    return undefined;
  }

  const IPFS_GATEWAY_URL = 'https://ipfs.io/ipfs/';
  if (IsValidIpfsUrl(url)) {
    return url.replace('ipfs://', IPFS_GATEWAY_URL);
  }

  return url;
}
