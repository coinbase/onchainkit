import React, { useEffect } from 'react';

const ThemeDetector: React.FC = () => {
  useEffect(() => {
    const applyThemeToTweets = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      const theme = isDarkMode ? 'dark' : 'light';
      document.querySelectorAll('.twitter-tweet').forEach((tweet) => {
        tweet.setAttribute('data-theme', theme);
      });
      console.log('Current theme:', theme);
    };

    // Apply theme on mount
    applyThemeToTweets();

    // Set up an observer to check when the class changes
    const observer = new MutationObserver(applyThemeToTweets);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Cleanup
    return () => observer.disconnect();
  }, []);

  return null;
};

export default ThemeDetector;