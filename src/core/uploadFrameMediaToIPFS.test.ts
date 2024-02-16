import { mockPinataUploadResponse } from './mock';
import { uploadFrameMediaToIPFS } from './uploadFrameMediaToIPFS';

describe('getFrameMetadata', () => {
  it('should return the correct metadata', async () => {
    const url = mockPinataUploadResponse();
    expect(url).toEqual("https://gateway.pinata.cloud/ipfs/QmfNvYKNHLFut99TRmwVAhKa1ePUoeqpgB61rxfzdoM5zq");
  });
});
