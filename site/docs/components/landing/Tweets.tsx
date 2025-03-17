import type React from 'react';
import { useEffect, useState } from 'react';

interface TweetCardProps {
  children: React.ReactNode;
  className?: string;
}

const TweetCard: React.FC<TweetCardProps> = ({ children, className }) => (
  <div className={`mx-auto w-full max-w-[400px] ${className || ''}`}>
    <blockquote className="twitter-tweet" data-dnt="true" data-theme="light">
      {children}
    </blockquote>
  </div>
);

const Tweets: React.FC = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;

    const handleLoad = () => setScriptLoaded(true);
    const handleError = () => setScriptLoaded(false);

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
      document.body.removeChild(script);
    };
  }, []);

  if (!scriptLoaded) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center md:mb-12">
          <h3 className="font-medium text-2xl text-gray-950 md:text-3xl dark:text-gray-50">
            Builders ship faster with OnchainKit
          </h3>
        </div>
        <div className="relative w-full">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-stretch md:justify-center md:gap-4 md:overflow-x-auto md:pb-4">
            <TweetCard className="tweet1 md:flex-shrink-0">
              <p lang="en" dir="ltr">
                🟣 Excited to announce that Basenames are now integrated into
                the Fit Club app! <br />
                <br />
                Thanks to{' '}
                <a href="https://twitter.com/OnchainKit?ref_src=twsrc%5Etfw">
                  @OnchainKit
                </a>{' '}
                for making it smooth and easy! 💜
                <br />
                <br />
                More updates on the way, stay fit. 🏋️‍♀️🏋️‍♂️{' '}
                <a href="https://t.co/5BlIm5kSx3">pic.twitter.com/5BlIm5kSx3</a>
              </p>
              — Fit Club (@fitclubonbase){' '}
              <a href="https://twitter.com/fitclubonbase/status/1826969613294334172?ref_src=twsrc%5Etfw">
                August 23, 2024
              </a>
            </TweetCard>
            <TweetCard className="tweet2 md:flex-shrink-0">
              <p lang="en" dir="ltr">
                Rush absolutely recommends Base devs to try{' '}
                <a href="https://twitter.com/OnchainKit?ref_src=twsrc%5Etfw">
                  @OnchainKit
                </a>
                , which can make life much easier with their cool SwapWidget and
                deep{' '}
                <a href="https://twitter.com/CoinbaseWallet?ref_src=twsrc%5Etfw">
                  @CoinbaseWallet
                </a>{' '}
                integration🥹{' '}
                <a href="https://t.co/yJJFjTr4nN">https://t.co/yJJFjTr4nN</a>
              </p>
              &mdash; Rush (@rushtradingx){' '}
              <a href="https://twitter.com/rushtradingx/status/1849197213702135863?ref_src=twsrc%5Etfw">
                October 23, 2024
              </a>
            </TweetCard>
            <TweetCard className="tweet3 md:flex-shrink-0">
              <p lang="en" dir="ltr">
                Swap is now live on our website! Feels good to be based, thanks
                guys 💙{' '}
                <a href="https://t.co/vunDYrnT2j">pic.twitter.com/vunDYrnT2j</a>
              </p>
              &mdash; KEYCAT (@KeyboardCatBase){' '}
              <a href="https://twitter.com/KeyboardCatBase/status/1838710257809252581?ref_src=twsrc%5Etfw">
                September 24, 2024
              </a>
            </TweetCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tweets;
