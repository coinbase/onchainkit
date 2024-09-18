import { useNftContext } from "./NftProvider";
import { defaultNftSvg } from '../../internal/svg/defaultNftSVG';
import { getCloudinaryMediaUrl } from "../utils/getCloudinaryMediaUrl";

export function NftVideo() {
  const { data } = useNftContext();

  if (!data?.media) {
    return <div className='max-h-350 w-350 max-w-350'>{defaultNftSvg}</div>;
  }
  console.log(getCloudinaryMediaUrl({media: data.media, type: 'video'}));
  return (
    <div className='max-h-350 w-350 max-w-350'>
      <video 
        poster={data.image}
        controls={true} 
        loop={true}
        src={data.media}
        muted={true}
        autoPlay={true}
        playsInline={true}
        draggable={false}
        width="100%"/>
    </div>
  );
}
