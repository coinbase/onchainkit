import { useState, useEffect, useRef, useCallback } from 'react';



// useAudioData - creates and returns { audioContext, audioData, audioBuffer }
// usePlaybackState - 
// useRenderAudio

type UseAudioBufferType = {
  audioUrl?: string;
  samples: number;  // number of samples (bars) in the final data
};

export const useAudioBuffer = ({audioUrl, samples}: UseAudioBufferType) => {
  const [audioData, setAudioData] = useState<number[] | undefined>();
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | undefined>();

  const audioContextRef = useRef(new window.AudioContext());
  const audioContext = audioContextRef.current;

  const loadAudioBuffer = useCallback(async (audioUrl: string) => {
    return fetch(audioUrl)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
  }, [audioContext]);

  const filterData = useCallback((audioBuffer: AudioBuffer) => {
    const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
    const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      const blockStart = blockSize * i; // the location of the first sample in the block
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
      }
      filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
    }
    return filteredData;  
  }, [samples]);

  useEffect(() => {
    async function load() {
      if (!audioUrl) {
        return;
      }

      const audioBuffer = await loadAudioBuffer(audioUrl);
      const audioData = filterData(audioBuffer);

      // const audioBufferSource = audioContext.createBufferSource();
      // audioBufferSource.buffer = audioBuffer;
      // audioBufferSource.connect(audioContext.destination);
      //refactor this, do i need this much stuffs?

      // audioBufferRef.current = audioContext.createBufferSource();
      // audioBufferRef.current.buffer = audioBuffer;
      // audioBufferRef.current.connect(audioContext.destination);

      setAudioBuffer(audioBuffer);
      setAudioData(audioData);
    }

    if (audioUrl) {
      load();
    }
  }, [audioUrl, loadAudioBuffer, filterData]);

  return { audioContext, audioBuffer, audioData };
};