/**
 * This function generates the metadata for a Farcaster Frame.
 * @param param0
 * @returns
 */
export const generateFrameNextMetadata = function ({
  buttons,
  image,
  post_url,
}: {
  buttons: string[];
  image: string;
  post_url: string;
}) {
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
