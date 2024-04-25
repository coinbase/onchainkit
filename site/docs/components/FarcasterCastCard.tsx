import { FarcasterEmbed } from 'react-farcaster-embed/dist/client';
import 'react-farcaster-embed/dist/styles.css';

type FarcasterCastCardProps = {
  castUrl: string;
};

export default function FarcasterCastCard({ castUrl }: FarcasterCastCardProps) {
  return (
    <div className="h-fit max-w-72 rounded-lg border md:max-w-md">
      <FarcasterEmbed url={castUrl} />
    </div>
  );
}
