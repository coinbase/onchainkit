import { FrameMetadata } from '@coinbase/onchainkit/frame';
import { defineConfig } from 'vocs';
import pkg from '../package.json';
import { sidebar } from './sidebar';

export const GOOGLE_ANALYTICS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? 'TEST_GA';

const ONCHAINKIT_TITLE = 'OnchainKit';
const ONCHAINKIT_DESCRIPTION =
  'React components and TypeScript utilities for top-tier onchain apps.';

export default defineConfig({
  baseUrl: 'https://onchainkit.xyz',
  title: ONCHAINKIT_TITLE,
  titleTemplate: '%s · OnchainKit',
  description: ONCHAINKIT_DESCRIPTION,
  ogImageUrl:
    'https://vocs.dev/api/og?logo=%logo&title=%title&description=%description',
  logoUrl: {
    light: '/favicon/48x48.png?v4-19-24',
    dark: '/favicon/48x48.png?v4-19-24',
  },
  twoslash: {
    compilerOptions: {
      allowUmdGlobalAccess: true,
      esModuleInterop: true,
      module: 200, //ModuleKind.Preserve,
    },
  },
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
              src: 'https://onchainkit.xyz/frame/install-onchainkit-3-24-24.png',
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
    {
      icon: 'x',
      link: 'https://x.com/Onchainkit',
    },
    {
      icon: 'warpcast',
      link: 'https://warpcast.com/~/channel/onchainkit',
    },
  ],
  theme: {
    accentColor: '#73F7FF',
    variables: {
      color: {
        background: {
          dark: '#151A26',
          light: 'white',
        },
        backgroundDark: {
          dark: '#0F131E',
          light: '#F3F4F6',
        },
        textAccent: {
          dark: 'white',
          light: '#030712',
        },
      },
    },
  },
  topNav: [
    { text: 'Docs', link: '/getting-started', match: '/docs' },
    {
      text: 'App Template',
      link: 'https://github.com/coinbase/onchain-app-template',
    },
    {
      text: 'Frame Template',
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
        {
          text: 'Report a bug',
          link: 'https://github.com/coinbase/onchainkit/issues',
        },
      ],
    },
  ],
  vite: {},
});
