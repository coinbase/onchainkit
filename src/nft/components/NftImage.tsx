import { useState, useEffect } from "react";
import { useNftContext } from "./NftProvider";
import { defaultNftSvg } from '../../internal/svg/defaultNftSVG';

export function NftImage() {
  const [loaded, setLoaded] = useState(false);
  const [transitionEnded, setTransitionEnded] = useState(false);

  const { data } = useNftContext();

  useEffect(() => {
    async function loadImage() {
      if (data?.image) {
        const img = new Image();
        img.onload = () => {
          setLoaded(true);
        };
        img.src = data.image;
        await img.decode();
      }
    }
    loadImage();
  }, [data]);

  const handleTransitionEnd = () => {
    setTransitionEnded(true);
  };

  return (
    <div className='relative'>
      {!transitionEnded && (
        <div className={`absolute inset-0 flex items-center justify-center ${loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000 ease-in-out`}>
          {defaultNftSvg}
        </div>
      )}
      <img
        src={data?.image}
        alt={data?.description}
        loading="lazy"
        decoding="async"
        className={`transition-opacity duration-1000 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onTransitionEnd={handleTransitionEnd}
      />
    </div>
  );
}
