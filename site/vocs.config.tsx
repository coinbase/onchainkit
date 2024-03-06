import { FrameMetadata } from '@coinbase/onchainkit';
import { defineConfig } from 'vocs';
import pkg from '../package.json';
import { sidebar } from './sidebar';

export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? 'TEST_GA';

const ONCHAINKIT_TITLE = 'OnchainKit';
const ONCHAINKIT_DESCRIPTION = `React components and TypeScript utilities for top-tier onchain apps.`;

export default defineConfig({
  baseUrl: 'https://onchainkit.xyz',
  title: ONCHAINKIT_TITLE,
  titleTemplate: '%s · OnchainKit',
  description: ONCHAINKIT_DESCRIPTION,
  ogImageUrl: 'https://vocs.dev/api/og?logo=%logo&title=%title&description=%description',
  logoUrl: { light: '/favicon/48x48.png', dark: '/favicon/48x48.png' },
  async head({ path }) {
    const analytics = (
      <>
        <script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          async
          defer
        />
        <script
          id="gtag-init"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ANALYTICS_ID}');
            `,
          }}
        />
      </>
    );

    if (path === '/') {
      return (
        <>
          <FrameMetadata
            buttons={[
              {
                action: 'link',
                label: 'Docs',
                target: 'https://onchainkit.xyz',
              },
              {
                action: 'link',
                label: 'Github',
                target: 'https://github.com/coinbase/onchainkit',
              },
            ]}
            image={{
              src: 'https://onchainkit.xyz/logo/v0-10.png',
            }}
          />
          {analytics}
        </>
      );
    }

    return <>{analytics}</>;
  },
  rootDir: './docs/',
  sidebar,
  socials: [
    {
      icon: 'github',
      link: 'https://github.com/coinbase/onchainkit',
    },
  ],
  theme: {
    accentColor: {
      light: '#FF5D2F',
      dark: '#FF5D2F',
    },
  },
  topNav: [
    { text: 'Docs', link: '/getting-started', match: '/docs' },
    {
      text: 'Onchain App Example',
      link: 'https://github.com/coinbase/build-onchain-apps',
    },
    {
      text: 'Frame Example',
      link: 'https://github.com/Zizzamia/a-frame-in-100-lines',
    },
    {
      text: pkg.version,
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/coinbase/onchainkit/blob/main/CHANGELOG.md',
        },
        {
          text: 'Contributing',
          link: 'https://github.com/coinbase/onchainkit/blob/main/CONTRIBUTING.md',
        },
      ],
    },
  ],
});
