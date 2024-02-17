import fs from 'fs';

type FrameMediaOptions = {
  pinataJwt: string;
  gatewayUrl: string;
  pathToMedia: string;
};

/**
 * Take a path string, read the file, and upload it to IPFS
 *
 * If the path is valid and upload is successful, return the IPFS gateway URL for use in the frame, otherwise, return an error.
 *
 * @param mediaOptions The JSON that includes the path string, the Pinata JWT, and the Gateway URL to use.
 */
async function uploadFrameMediaToIPFS(
  mediaOptions: FrameMediaOptions,
): Promise<string> {
  const formData: any = new FormData();
  const readableStreamForFile = fs.createReadStream(mediaOptions.pathToMedia);

  if(!readableStreamForFile) {
    throw new Error("Could not find file at path provided");
  }

  const pinataMetadata = JSON.stringify({
    name: `frame-media-${new Date()}`,
  });
  formData.append('pinataMetadata', pinataMetadata);

  formData.append('file', readableStreamForFile)
  try{
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST", 
      headers: {
        "Authorization": `Bearer ${mediaOptions.pinataJwt}`
      }
    });

    const data = await res.json();
    const { IpfsHash } = data;
    const url = `${mediaOptions.gatewayUrl}/ipfs/${IpfsHash}`
    return url
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export { uploadFrameMediaToIPFS };
