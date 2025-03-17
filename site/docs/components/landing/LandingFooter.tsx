import type React from 'react';

const FooterColumn = ({
  title,
  links,
}: { title: string; links: { text: string; href: string }[] }) => (
  <div className="flex flex-col space-y-2">
    <h3 className="pb-2 font-semibold text-zinc-950 dark:text-zinc-50">
      {title}
    </h3>
    {links.map((link) => (
      <a
        key={link.href}
        href={link.href}
        className="text-base text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        {link.text}
      </a>
    ))}
  </div>
);

const LandingFooter: React.FC = () => {
  const footerData = [
    {
      title: 'Components',
      links: [
        { text: 'Buy', href: 'https://onchainkit.xyz/buy/buy' },
        { text: 'Wallet', href: 'https://onchainkit.xyz/wallet/wallet' },
        { text: 'Swap', href: 'https://onchainkit.xyz/swap/swap' },
        {
          text: 'Transaction',
          href: 'https://onchainkit.xyz/transaction/transaction',
        },
        { text: 'Checkout', href: 'https://onchainkit.xyz/checkout/checkout' },
        { text: 'Fund', href: 'https://onchainkit.xyz/fund/fund-button' },
        { text: 'Identity', href: 'https://onchainkit.xyz/identity/identity' },
        { text: 'Token', href: 'https://onchainkit.xyz/token/token-chip' },
      ],
    },
    {
      title: 'Templates',
      links: [
        {
          text: 'Commerce',
          href: 'https://onchain-commerce-template.vercel.app/',
        },
        {
          text: 'NFT',
          href: 'https://github.com/coinbase/onchain-app-template',
        },
        {
          text: 'Social Profile',
          href: 'https://github.com/fakepixels/ock-identity',
        },
      ],
    },
    {
      title: 'OnchainKit',
      links: [
        { text: 'Docs', href: 'https://onchainkit.xyz/getting-started' },
        { text: 'Github', href: 'https://github.com/coinbase/onchainkit' },
        {
          text: 'Discord',
          href: 'https://discord.com/channels/1220414409550336183/1253768005863739565',
        },
        { text: 'Twitter', href: 'https://x.com/Onchainkit' },
        { text: 'Warpcast', href: 'https://warpcast.com/~/channel/onchainkit' },
        {
          text: 'Contribute',
          href: 'https://onchainkit.xyz/guides/contribution',
        },
        {
          text: 'Terms of Service',
          href: 'https://www.coinbase.com/legal/cloud/terms-of-service',
        },
        {
          text: 'Privacy Policy',
          href: 'https://www.coinbase.com/legal/privacy',
        },
      ],
    },
    {
      title: 'Base',
      links: [
        { text: 'About', href: 'https://www.base.org/' },
        {
          text: 'Grants',
          href: 'https://paragraph.xyz/@grants.base.eth/calling-based-builders?utm_source=dotorg&utm_medium=nav',
        },
        {
          text: 'Careers',
          href: 'https://www.base.org/jobs?utm_source=dotorg&utm_medium=nav',
        },
      ],
    },
  ];

  return (
    <footer className="py-12 text-zinc-50 dark:text-zinc-950">
      <div className="w-full md:w-[1100px]">
        <div className="flex flex-col items-start justify-between md:flex-row">
          <div className="flex w-full items-center pb-8 md:w-auto">
            <img
              src="/favicon/48x48.png?v4-19-24"
              alt="OnchainKit Logo"
              className="h-12 w-12"
            />
          </div>
          <div className="mb-8 grid w-full grid-cols-2 gap-8 md:mb-0 md:flex md:w-auto md:gap-24">
            {footerData.map((column, index) => (
              <FooterColumn
                key={`${column.title}-${index}`}
                title={column.title}
                links={column.links}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
