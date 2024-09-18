import { useState, useEffect, useCallback } from 'react';

type UseAudioPlaybackStateType = {
  audioContext: AudioContext;
  audioBuffer?: AudioBuffer;
  audioData?: number[];
};

export const useAudioPlaybackState = ({audioContext, audioBuffer, audioData}: UseAudioPlaybackStateType) => {
  const [audioState, setAudioState] = useState('suspended');
  const [currentTime, setCurrentTime] = useState(0);

  const audioBufferSource = audioContext.createBufferSource();
  if (audioBuffer) {
    audioBufferSource.buffer = audioBuffer;
    audioBufferSource.connect(audioContext.destination);
  }

  const getCurrentTime = useCallback(() => {
    const timestamp = audioContext.getOutputTimestamp();
    return timestamp.contextTime ?? 0;
  }, [audioContext]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    if (audioBuffer && audioData && audioState === 'running') {
      intervalId = setInterval(() => {
        const currentTime = getCurrentTime();
        setCurrentTime(currentTime);
      }, 250);
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [audioState, audioBuffer, audioData, getCurrentTime]);

  const handlePlayPause = () => {
    if (audioContext.state === 'running') {
      audioContext.suspend().then(() => {
        setAudioState('suspended');
      });
    } else if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        setAudioState('running');
        const currentTime = getCurrentTime();
        if (currentTime === 0 && audioBufferSource) {
          audioBufferSource.start(0);
          audioBufferSource.onended = () => {
            setAudioState('suspended');
          }
        }
      });
    }
  };

  return { audioState, currentTime, handlePlayPause };
};