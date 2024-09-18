import { Nft, NftCreator, NftMedia, NftTokenId, NftCollectionTitle, NftOwner, NftPrice, NftDate, NftQuantitySelector } from '../../../src/nft/index.ts';

// ERC1155 - 0xc6A1F929B7cA5D76e0fA21EB44da1E48765990C5
// ERC721 - 0x44c035C45E164b37991fE29061D7828F20EBf3Cb

// Video - 0x1f52841279fA4dE8B606a70373E9c84e84Ce9204

// audio - 0x05a28e3d5f68c8b4a521ab7f74bd887fae6a598d

export default function NftWrapper() {
  return (
    <Nft contractAddress="0x1f52841279fA4dE8B606a70373E9c84e84Ce9204" tokenId={1}>
      <NftCreator />
      <NftMedia />
      <NftCollectionTitle />
      <NftOwner />
      <NftTokenId />
      <NftPrice />
      <NftDate />
      <NftQuantitySelector />
    </Nft>
  );
};