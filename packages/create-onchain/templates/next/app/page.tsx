'use client';

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import ArrowSvg from './svg/ArrowSvg';
import ImageSvg from './svg/Image';
import OnchainkitSvg from './svg/OnchainKit';

const components = [
  {
    name: 'Transaction',
    url: 'https://onchainkit.xyz/transaction/transaction',
  },
  { name: 'Swap', url: 'https://onchainkit.xyz/swap/swap' },
  { name: 'Checkout', url: 'https://onchainkit.xyz/checkout/checkout' },
  { name: 'Wallet', url: 'https://onchainkit.xyz/wallet/wallet' },
  { name: 'Identity', url: 'https://onchainkit.xyz/identity/identity' },
];

const templates = [
  { name: 'NFT', url: 'https://github.com/coinbase/onchain-app-template' },
  { name: 'Commerce', url: 'https://github.com/coinbase/onchain-commerce-template'},
  { name: 'Fund', url: 'https://github.com/fakepixels/fund-component' },
];

export default function App() {
  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">
      <header className="pt-4 pr-4">
        <div className="flex justify-end">
          <div className="wallet-container">
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownLink
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl w-full p-4">
          <div className="w-1/3 mx-auto mb-6">
            <ImageSvg />
          </div>
          <div className="flex justify-center mb-6">
            <a target="_blank" rel="_template" href="https://onchainkit.xyz">
              <OnchainkitSvg className="dark:text-white text-black" />
            </a>
          </div>
          <p className="text-center mb-6">
            Get started by editing
            <code className="p-1 ml-1 rounded dark:bg-gray-800 bg-gray-200">app/page.tsx</code>.
          </p>
          <div className="flex flex-col items-center">
            <div className="max-w-2xl w-full">
              <div className="flex flex-col md:flex-row justify-between mt-4">
                <div className="md:w-1/2 mb-4 md:mb-0 flex flex-col items-center">
                  <p className="font-semibold mb-2 text-center">
                    Explore components
                  </p>
                  <ul className="list-disc pl-5 space-y-2 inline-block text-left">
                    {components.map((component, index) => (
                      <li key={index}>
                        <a
                          href={component.url}
                          className="hover:underline inline-flex items-center dark:text-white text-black"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {component.name}
                          <ArrowSvg />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:w-1/2 flex flex-col items-center">
                  <p className="font-semibold mb-2 text-center">
                    Explore templates
                  </p>
                  <ul className="list-disc pl-5 space-y-2 inline-block text-left">
                    {templates.map((template, index) => (
                      <li key={index}>
                        <a
                          href={template.url}
                          className="hover:underline inline-flex items-center dark:text-white text-black"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {template.name}
                          <ArrowSvg/>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
