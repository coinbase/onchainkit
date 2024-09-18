import { useNftContext } from './NftProvider';
import AudioPlayer from './AudioPlayer';

type NftAudioProps = {
  className?: string;
};

export function NftAudio({className}:NftAudioProps) {
  const { data } = useNftContext();
  const audioUrl = data?.media;

  if (!audioUrl) {
    return null;
  }

  return <AudioPlayer audioUrl={audioUrl} className={className} />
}



  // TODO: refactor this into an AudioControls components

  // need to figure out how to handle restart
  // update to use the non AudioBuffer thing
  // set the interval to just trigger for 30 times...since thats how many bars
  //   based off the duration of the audio
