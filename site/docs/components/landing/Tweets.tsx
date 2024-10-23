import type React from 'react';
import { useEffect, useState } from 'react';

interface TweetCardProps {
  children: React.ReactNode;
  className?: string;
}

const TweetCard: React.FC<TweetCardProps> = ({ children, className }) => (
  <div className={`w-[400px] flex-shrink-0 ${className || ''}`}>
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
    <section className="w-full py-24">
      <div className="mb-12 text-center">
        <h3 className="mx-auto font-medium text-3xl text-gray-950 dark:text-gray-50">
          Builders ship faster with OnchainKit
        </h3>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex items-start space-x-8">
          <TweetCard className="tweet1">
            <p lang="en" dir="ltr">
              🟣 Excited to announce that Basenames are now integrated into the
              Fit Club app! <br />
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
          <TweetCard className="tweet2">
            <p lang="en" dir="ltr">
              Building with
              <a href="https://twitter.com/OnchainKit?ref_src=twsrc%5Etfw">
                @OnchainKit
              </a>{' '}
              has been such a great experience so far. We&#39;re builders, and
              we like to build things from scratch. But with{' '}
              <a href="https://twitter.com/OnchainKit?ref_src=twsrc%5Etfw">
                @OnchainKit
              </a>
              , there was a real boost in productivity, allowing us to ship
              dApps with seamless functionality in a matter of minutes. <br />
              <br />
              Onto the next…{' '}
              <a href="https://t.co/QzlJ4RIKLG">https://t.co/QzlJ4RIKLG</a>
            </p>
            &mdash; Coinfever (@coinfeverapp){' '}
            <a href="https://twitter.com/coinfeverapp/status/1842230362337915205?ref_src=twsrc%5Etfw">
              October 4, 2024
            </a>
          </TweetCard>
          <TweetCard className="tweet3">
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
    </section>
  );
};

export default Tweets;
