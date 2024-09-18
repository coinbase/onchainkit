import { NftMint, Nft, NftMedia, NftCollectionTitle, NftTokenId, NftCreator, NftMintButton, NftOwner, NftLastSalePrice, NftDate, NftQuantitySelector, NftTotalCost } from "@/onchainkit/esm/nft";

// ERC1155 - 0xc6A1F929B7cA5D76e0fA21EB44da1E48765990C5
// ERC721 - 0x44c035C45E164b37991fE29061D7828F20EBf3Cb

// Video - 0x1f52841279fA4dE8B606a70373E9c84e84Ce9204

// audio - 0x05a28e3d5f68c8b4a521ab7f74bd887fae6a598d

// 0xd9c036e9eef725e5aca4a22239a23feb47c3f05d/1343


// more 721
//0x473d2D4C09669962c2CbDB1c34ba8f0fc843Fb69
//0xe3181fA43DDe062b0B0069d52b26486FdeE97299

// 1155 
// 0x77ac5c83abbb3f781ff5ab459ac07d4d749ab046:2
function NftDemo() {
  return (
    <>
      <p>NFT</p>
      <Nft contractAddress="0xc6A1F929B7cA5D76e0fA21EB44da1E48765990C5" tokenId={1}>
        <NftCreator />
        <NftMedia />
        <NftCollectionTitle />
        <NftOwner />
        <NftLastSalePrice />
        <NftTokenId />
        <NftDate />
      </Nft>

      <p>NFT Mint</p>
      <NftMint contractAddress="0x77ac5c83abbb3f781ff5ab459ac07d4d749ab046" tokenId={2}>
        <NftCreator />
        <NftMedia />
        <NftCollectionTitle />
        <NftTotalCost />
        <NftQuantitySelector />
        <NftMintButton />
      </NftMint>

      <div style={{height: '200px'}}/>
    </>
  );
};

export default NftDemo;



// TODO: Wednesday!!!!  move the quantity state to the provider and wire it up so totalCost reflects the quantity
// try to create a mint button

