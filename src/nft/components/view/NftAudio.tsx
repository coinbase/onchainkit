import { useCallback, useEffect, useRef, useState } from 'react';
import { background, cn } from '../../../styles/theme';
import { useNftContext } from '../NftProvider';
import type { NftError } from '../../types';

type NftAudioReact = {
  className?: string;
  onLoading?: (mediaUrl: string) => void;
  onLoaded?: () => void;
  onError?: (error: NftError) => void;
};

export function NftAudio({
  className,
  onLoading,
  onLoaded,
  onError,
}: NftAudioReact) {
  const { animationUrl } = useNftContext();
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
          code: 'NmNAc01', // Nft module NftAudio component 01 error
          message: 'Error loading audio',
        });
      };
    }

    return () => audioRef.current?.removeEventListener('ended', onEnded);
  }, [animationUrl, onLoading, onLoaded, onError]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

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
            'border-transparent border-l-[var(--ock-bg-default)] hover:border-l-[var(--ock-bg-default-hover)]',
            {
              'border-[length:0_0_0_16px] border-double': isPlaying,
              'border-[length:9px_0_9px_16px] border-solid': !isPlaying,
            },
          )}
        />
      </button>
      <audio
        ref={audioRef}
        data-testid="ockNftAudio"
        autoPlay={false}
        controls={false}
        src={animationUrl}
      >
        <track kind="captions" />
      </audio>
    </div>
  );
}
