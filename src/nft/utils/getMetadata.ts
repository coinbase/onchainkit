import { IPFS_PROXY } from '../constants';

type GetMetadataParams = {
  tokenUri: string;
};

export type Metadata = {
  animation_url?: string;
  name: string;
  description: string;
  image?: string;
  external_url?: string;
  youtube_url?: string;
  attributes?: [];
};

export const getMetadata = async ({
  tokenUri,
}: GetMetadataParams): Promise<Metadata | null> => {
  try {
    if (tokenUri.startsWith('data:application/json;base64')) {
      const base64String = tokenUri.replace(
        'data:application/json;base64,',
        '',
      );
      const metadata = JSON.parse(atob(base64String));
      const image = metadata.image.replace('ipfs://', IPFS_PROXY);
      return {
        ...metadata,
        image,
      };
    }

    if (tokenUri.startsWith('ar://')) {
      const arweaveUrl = tokenUri.replace('ar://', 'https://arweave.net/');
      const response = await fetch(arweaveUrl);
      const metadata = await response.json();
      const image = metadata.image.replace('ipfs://', IPFS_PROXY); // ?? could this also be arweave?
      return {
        ...metadata,
        image,
      };
    }

    if (tokenUri.startsWith('ipfs://')) {
      const ipfsUrl = tokenUri.replace('ipfs://', IPFS_PROXY);
      const response = await fetch(ipfsUrl);
      const metadata = await response.json();
      const image = metadata.image.replace('ipfs://', IPFS_PROXY);
      return {
        ...metadata,
        image,
      };
    }

    if (tokenUri.startsWith('https://')) {
      const response = await fetch(tokenUri);
      const metadata = await response.json();
      const image = metadata.image.replace('ipfs://', IPFS_PROXY);
      return {
        ...metadata,
        image,
      };
    }

    return {
      animation_url: '',
      name: '',
      description: '',
      image: '',
      // image_data: "", // is this needed???
      external_url: '',
      youtube_url: '',
      attributes: [],
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    return null;
  }
};
