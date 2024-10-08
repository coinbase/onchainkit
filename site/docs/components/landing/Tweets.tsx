import { useEffect, useState } from 'react';

const Tweets = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;

    // Set script onload to true when it's loaded
    script.onload = () => {
      setScriptLoaded(true);
    };

    // Set script onerror to handle failure to load
    script.onerror = () => {
      setScriptLoaded(false);
    };

    document.body.appendChild(script);

    // Cleanup the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!scriptLoaded) {
    // If the script isn't loaded yet, return null.
    return null;
  }

  return (
    <section className="css-alternate-container flex w-full flex-col items-center gap-[48px] py-24">
      <div>
        <h3 className="max-w-[525px] basis-1/2 text-center text-4xl text-gray-950 md:text-4xl dark:text-gray-50">
          Builders ship faster with OnchainKit
        </h3>
      </div>
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="flex w-full max-w-[438px] justify-center">
          <blockquote
            className="twitter-tweet tweet1"
            data-dnt="true"
            data-theme="light"
          >
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
          </blockquote>
        </div>
        <div className="flex max-w-[648px] flex-col items-center gap-6 md:items-start">
          <blockquote
            className="twitter-tweet tweet2"
            data-dnt="true"
            data-theme="light"
          >
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
          </blockquote>
          <blockquote
            className="twitter-tweet tweet3"
            data-conversation="none"
            data-dnt="true"
            data-theme="light"
          >
            <p lang="en" dir="ltr">
              Swap is now live on our website! Feels good to be based, thanks
              guys 💙{' '}
              <a href="https://t.co/vunDYrnT2j">pic.twitter.com/vunDYrnT2j</a>
            </p>
            &mdash; KEYCAT (@KeyboardCatBase){' '}
            <a href="https://twitter.com/KeyboardCatBase/status/1838710257809252581?ref_src=twsrc%5Etfw">
              September 24, 2024
            </a>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default Tweets;
