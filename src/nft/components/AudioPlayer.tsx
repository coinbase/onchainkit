import { useEffect, useRef, useCallback } from 'react';
import { useAudioPlaybackState } from '../hooks/useAudioPlaybackState';
import { useRenderAudio } from '../hooks/useRenderAudio';
import { useAudioBuffer } from '../hooks/useAudioBuffer';
import { cn, color, text } from '../../styles/theme';

const NUM_BARS = 30;

type AudioPlayerProps = {
  className?: string;
  audioUrl: string;
};

function AudioPlayer({ className, audioUrl }: AudioPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // TODO: 
  // - handle restart
  // - set interval to trigger for 30 times base off duration of audio

  const { audioContext, audioBuffer, audioData } = useAudioBuffer({audioUrl, samples: NUM_BARS});
  const { audioState, currentTime, handlePlayPause } = useAudioPlaybackState({audioContext, audioBuffer, audioData});
  const { render, renderTime } = useRenderAudio(canvasRef);

  useEffect(() => {
    if (audioData) {
      render(audioData);
    }
  }, [audioData, render]);

  useEffect(() => {
    if (audioBuffer && audioData && audioState === 'running') {
      const currentIndex = Math.floor((currentTime / audioBuffer.duration) * audioData.length);
      renderTime(audioData[currentIndex], currentIndex);
    }
  }, [audioState, currentTime, audioBuffer, audioData, renderTime]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    // Add leading zeros if necessary
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  
    return `${minutes}:${formattedSeconds}`;
  }, []);

  return (
    <div className={cn(
      text.body,
      color.foregroundMuted,
      'flex max-h-[44px] w-full justify-between px-4',
      className,
    )}>
      <button
        type="button"
        className="inline-flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full bg-white"
        onClick={handlePlayPause}
      >
        <div className={`box-border h-[18px] border-transparent border-l-black transition-all ease-[100ms] will-change-[border-width] ${
          audioState === 'running' ? 'border-[length:0_0_0_16px] border-double' : 'border-[length:9px_0_9px_16px] border-solid'
        }`}/>
      </button>
      <div className='flex h-[42px] items-center justify-between rounded-lg bg-white px-4'>
        <div>{formatTime(Math.min(currentTime, audioBuffer?.duration ?? 0))}</div>
        <div className='px-2'>
          <canvas width={175} height={42} ref={canvasRef} />
        </div>
        <div>{audioBuffer?.duration && formatTime(audioBuffer.duration)}</div>
      </div>
      <div/>
    </div>
  );
};

export default AudioPlayer;
