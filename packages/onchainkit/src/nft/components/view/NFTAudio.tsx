import type { NFTError } from '@/api/types';
import { useNFTContext } from '@/nft/components/NFTProvider';
import {
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { background, cn } from '../../../styles/theme';

type NFTAudioReact = {
  className?: string;
  onLoading?: (mediaUrl: string) => void;
  onLoaded?: () => void;
  onError?: (error: NFTError) => void;
};

export function NFTAudio({
  className,
  onLoading,
  onLoaded,
  onError,
}: NFTAudioReact) {
  const { animationUrl } = useNFTContext();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    function onEnded() {
      setIsPlaying(false);
    }

    if (animationUrl && audioRef?.current) {
      audioRef.current.onloadstart = () => {
        onLoading?.(animationUrl);
      };

      audioRef.current.onloadeddata = () => {
        onLoaded?.();
      };

      audioRef.current.addEventListener('ended', onEnded);

      audioRef.current.onerror = (error: string | Event) => {
        onError?.({
          error: typeof error === 'string' ? error : error.type,
          code: 'NmNAc01', // NFT module NFTAudio component 01 error
          message: 'Error loading audio',
        });
      };
    }
  }, [animationUrl, onLoading, onLoaded, onError]);

  const handlePlayPause = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    },
    [isPlaying],
  );

  if (!animationUrl) {
    return null;
  }

  return (
    <div className={cn('max-h-350 w-350 max-w-350', className)}>
      <button
        type="button"
        className={cn(
          background.reverse,
          'ml-6 inline-flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full',
        )}
        onClick={handlePlayPause}
      >
        <div
          className={cn(
            'ml-px box-border h-[18px] transition-all ease-[100ms] will-change-[border-width]',
            'border-[var(--ock-bg-default-reverse)] border-l-[var(--ock-bg-default)]',
            {
              'border-[length:0_0_0_16px] border-double': isPlaying,
              '-mr-px border-[length:9px_0_9px_16px] border-solid': !isPlaying,
            },
          )}
        />
      </button>
      <audio
        ref={audioRef}
        data-testid="ockNFTAudio"
        autoPlay={false}
        controls={false}
        src={animationUrl}
      >
        <track kind="captions" />
      </audio>
    </div>
  );
}
