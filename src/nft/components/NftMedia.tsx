import { useNftContext } from "./NftProvider";
import { useMediaType } from "../hooks/useMediaType";
import { NftImage } from "./NftImage";
import { NftVideo } from "./NftVideo";
import { NftAudio } from "./NftAudio";

  export function NftMedia() {
  const { data } = useNftContext();

  const media = useMediaType(data?.mimeType);

  if (media.isVideo) {
    return <NftVideo />
  }

  if (media.isAudio) {
    return (
      <div className="relative w-full">
        <NftImage />
        <div className="absolute bottom-[20px] mx-auto w-full">
          <NftAudio />
        </div>
      </div>
    );
  }

  return <NftImage />;
}


/*

<iframe srcdoc="<img src=https://d33wubrfki0l68.cloudfront.net/1b8d4f82d6234596c249121ca6d78a19f68255a9/1ff0e/blog/svg-xss-injection-attacks/logo.svg>" sandbox="">
</iframe>

              <CollectibleMediaFrame
                title={tokenType}
                id="media-frame"
                scrolling="no"
                data-testid="media-iframe-container"
                onLoad={handleMediaLoadSuccess}
                onError={handleMediaLoadFailure}
                preview={preview}
              >
                {mediaItem}
              </CollectibleMediaFrame>

              const CollectibleMediaFrame = styled(IFramePortal)`
  height: 100%;
  width: 100%;
  display: block;
  margin: 0px;
  padding: 0px;
  overflow: hidden;
  pointer-events: none;
`;

*/