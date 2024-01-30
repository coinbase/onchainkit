type FrameMetadataResponse = {
  buttons: string[];
  image: string;
  post_url: string;
};

/**
 * This function generates the metadata for a Farcaster Frame.
 * @param buttons: An array of button names.
 * @param image: The image to use for the frame.
 * @param post_url: The URL to post the frame to.
 * @returns The metadata for the frame.
 */
export const getFrameMetadata = function ({ buttons, image, post_url }: FrameMetadataResponse) {
  const metadata: Record<string, string> = {
    'fc:frame': 'vNext',
  };
  buttons.forEach((button, index) => {
    metadata[`fc:frame:button:${index + 1}`] = button;
  });
  metadata['fc:frame:image'] = image;
  metadata['fc:frame:post_url'] = post_url;
  return metadata;
};
