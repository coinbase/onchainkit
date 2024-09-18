
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
export function convertIpfsToHttps(url: string): string {
  const IPFS_GATEWAY_URL = 'https://b891d14d436694bb9a7feeba91730b95.ipfscdn.io/ipfs/';
  if (IsValidIpfsUrl(url)) {
    return url.replace('ipfs://', IPFS_GATEWAY_URL);
  }

  return url;
}


const CLOUDINARY_HOSTNAME = 'res.cloudinary.com';
const COINBASE_CLOUDINARY_PATHNAME_PREFIX = '/coin-nft/';

export type CloudinaryMediaUrl =
  | `https://res.cloudinary.com${string}`
  | `data:image/png;base64${string}`;

export function isCloudinaryMediaUrl(url: string): url is CloudinaryMediaUrl {
  try {
    if (url.startsWith('data:image/png;base64')) {
      return true;
    }
    const urlObj = new URL(url);
    return (
      urlObj.hostname === CLOUDINARY_HOSTNAME &&
      urlObj.pathname.startsWith(COINBASE_CLOUDINARY_PATHNAME_PREFIX)
    );
  } catch {
    return false;
  }
}


export type MediaQuality = 'max' | 'high' | 'auto' | 'autobest';

/**
 * Mapping internal media quality types to Cloudinary query params
 * See https://cloudinary.com/documentation/image_optimization#automatic_quality_selection_q_auto
 * and https://cloudinary.com/documentation/image_optimization#set_the_quality_when_delivering_an_image
 * for more information on quality params.
 */
const MEDIA_QUALITY_MAP: Record<MediaQuality, string> = {
  max: '100',
  high: '90',
  auto: 'auto',
  autobest: 'auto:best',
};

export type CloudinaryUrlOptions = {
  width?: number;
  quality?: MediaQuality;
  flag?: 'progressive' | 'animated';
  cropResize?: 'crop' | 'fill' | 'fill_pad' | 'fit' | 'limit' | 'lpad' | 'pad' | 'scale' | 'limit';
  disableUriEncoding?: boolean;
  transformationType?: string;
  retrievalMethod?: 'fetch' | 'upload';
};

export type GetCloudinaryMediaUrlParams = {
  media: string;
  options?: CloudinaryUrlOptions;
  type?: 'image' | 'video';
};

const CLOUDINARY_ROOT_URL = 'https://res.cloudinary.com/coin-nft';

/**
 * Extracts the Cloudinary media URL for an image or video with optional transformations.
 *
 * @param media URL of the media (image or video)
 * @param options Optional flags for transforming the media
 * @param type Type of media ('image' or 'video')
 * @returns cloudinary URL for the media
 * @link https://cloudinary.com/documentation/transformation_reference
 */
export function getCloudinaryMediaUrl({
  media,
  options,
  type = 'image',
}: GetCloudinaryMediaUrlParams): CloudinaryMediaUrl {
  if (isCloudinaryMediaUrl(media)) {
    return media;
  }

  const { width, quality = 'high', flag, cropResize, disableUriEncoding } = options || {};

  const qualityParam = `q_${MEDIA_QUALITY_MAP[quality]}`;
  const widthParam = width ? `,w_${width}` : '';
  const flagParam = flag ? `,fl_${flag}` : '';
  const cropResizeParam = cropResize ? `c_${cropResize},` : '';
  const ipfsHttps = convertIpfsToHttps(String(media));
  const encodedUrl = disableUriEncoding ? ipfsHttps : encodeURI(ipfsHttps);

  const defaultTransformationType = type === 'video' ? 'f_auto:video' : 'f_auto';
  const transformationType = options?.transformationType
    ? `f_${options?.transformationType}`
    : defaultTransformationType;

  return options?.retrievalMethod === 'upload'
    ? `${CLOUDINARY_ROOT_URL}/${type}/upload/${cropResizeParam}${qualityParam}${widthParam}${flagParam}/${transformationType}/v1/cache/${encodedUrl}`
    : `${CLOUDINARY_ROOT_URL}/${type}/fetch/${cropResizeParam}${qualityParam}${widthParam}${flagParam}/${transformationType}/${encodedUrl}`;
}
