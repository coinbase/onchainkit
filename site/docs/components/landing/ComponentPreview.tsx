import React, { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import CopyIcon from '../svg/CopySvg.tsx';
import CheckIcon from '../svg/checkSvg.tsx';

// Demo components and code snippets
import CheckoutDemo, { checkoutDemoCode } from './CheckoutDemo.tsx';
import FundDemo, { fundDemoCode } from './FundDemo.tsx';
import IdentityDemo, { identityDemoCode } from './IdentityDemo.tsx';
import SwapDemo, { swapDemoCode } from './SwapDemo.tsx';
import TransactionDemo, { transactionDemoCode } from './TransactionDemo.tsx';
import WalletDemo, { walletDemoCode } from './WalletDemo.tsx';

type Component = {
  name: string;
  component: React.ComponentType;
  code: string;
  description: string;
};

const components: Component[] = [
  {
    name: 'Wallet',
    component: WalletDemo,
    code: walletDemoCode,
    description: 'Enable users to onboard and log into your app with a wallet.',
  },
  {
    name: 'Swap',
    component: SwapDemo,
    code: swapDemoCode,
    description: 'Enable swaps between different cryptocurrencies.',
  },
  {
    name: 'Checkout',
    component: CheckoutDemo,
    code: checkoutDemoCode,
    description:
      'Accept USDC payments with instant user onboarding and onramps.',
  },
  {
    name: 'Transaction',
    component: TransactionDemo,
    code: transactionDemoCode,
    description: 'Trigger onchain transactions and sponsor them with Paymaster',
  },
  {
    name: 'Fund',
    component: FundDemo,
    code: fundDemoCode,
    description: 'Fund wallets with a debit card or a coinbase account.',
  },
  {
    name: 'Identity',
    component: IdentityDemo,
    code: identityDemoCode,
    description:
      'Display the Basename, avatar, and address associated with a wallet.',
  },
];

function ComponentPreview() {
  const [isClient, setIsClient] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<'preview' | 'code'>(
    'preview',
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 600);
    });
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <ComponentList
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          components={components}
        />
        <PreviewContainer
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
          copiedIndex={copiedIndex}
          copyToClipboard={copyToClipboard}
        />
      </div>
    </div>
  );
}

interface ComponentListProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
  components: Component[];
}

function ComponentList({
  activeTab,
  setActiveTab,
  components,
}: ComponentListProps) {
  return (
    <div className="w-full md:w-[300px] lg:flex-shrink-0">
      <h3 className="pb-4 font-medium text-3xl text-zinc-900 dark:text-zinc-100">
        Ready-to-use components
      </h3>
      <div className="pb-6 text-lg text-zinc-700 dark:text-zinc-500">
        Accelerate your time-to-market with prebuilt components.
      </div>
      <div className="flex flex-col">
        {components.map((comp, index) => (
          <div key={comp.name} className="mb-4">
            <button
              type="button"
              className={`w-full px-3 py-2 text-left text-base lg:text-lg ${
                activeTab === index
                  ? 'rounded-lg bg-zinc-100 font-semibold text-indigo-600 dark:bg-[#0F0F0F] dark:text-indigo-400'
                  : 'text-zinc-700 hover:rounded-lg hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-[#0F0F0F]'
              }`}
              onClick={() => setActiveTab(index)}
            >
              {comp.name}
              {activeTab === index && (
                <div className="mt-1 font-normal text-sm text-zinc-600 dark:text-zinc-400">
                  {comp.description}
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

type PreviewContainerProps = {
  activeTab: number;
  activeSubTab: 'preview' | 'code';
  setActiveSubTab: (subTab: 'preview' | 'code') => void;
  copiedIndex: number | null;
  copyToClipboard: (text: string, index: number) => void;
};

function PreviewContainer({
  activeTab,
  activeSubTab,
  setActiveSubTab,
  copiedIndex,
  copyToClipboard,
}: PreviewContainerProps) {
  const ActiveComponent = components[activeTab].component;

  return (
    <div className="w-full flex-shrink-0 lg:w-[640px] xl:w-[720px]">
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-900">
        <div className="relative w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-[#0F0F0F]">
          <div className="flex items-center justify-between border-zinc-200 border-b dark:border-zinc-900">
            <div className="flex">
              <button
                type="button"
                className={`mt-2 ml-2 px-4 py-2 text-sm ${
                  activeSubTab === 'preview'
                    ? 'border-indigo-600 border-b-2 bg-zinc-100 text-zinc-950 dark:border-indigo-400 dark:bg-[#0F0F0F] dark:text-zinc-50'
                    : 'text-zinc-700 dark:text-zinc-300'
                }`}
                onClick={() => setActiveSubTab('preview')}
              >
                Preview
              </button>
              <button
                type="button"
                className={`mt-2 px-4 py-2 text-sm ${
                  activeSubTab === 'code'
                    ? 'border-indigo-600 border-b-2 text-zinc-950 dark:border-indigo-400 dark:text-zinc-50'
                    : 'text-zinc-700 dark:text-zinc-300'
                }`}
                onClick={() => setActiveSubTab('code')}
              >
                Code
              </button>
            </div>
            {activeSubTab === 'code' && (
              <button
                type="button"
                className="mr-2 rounded-md p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                onClick={() =>
                  copyToClipboard(components[activeTab].code, activeTab)
                }
                title={
                  copiedIndex === activeTab ? 'Copied!' : 'Copy to clipboard'
                }
              >
                {copiedIndex === activeTab ? (
                  <CheckIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
                ) : (
                  <CopyIcon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                )}
              </button>
            )}
          </div>
          <div className="h-[500px] overflow-auto">
            <div
              className={`${
                activeSubTab === 'preview' ? 'flex' : 'hidden'
              } h-full w-full items-center justify-center p-4`}
            >
              <div className="flex w-full max-w-[360px] items-center justify-center lg:max-w-none">
                <ActiveComponent />
              </div>
            </div>
            <div
              className={`${
                activeSubTab === 'code' ? 'block' : 'hidden'
              } h-full w-full p-4`}
            >
              <ShikiHighlight
                code={components[activeTab].code}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ShikiHighlightProps {
  code: string;
}

function ShikiHighlight({ code }: ShikiHighlightProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('');

  useEffect(() => {
    async function highlightCode() {
      const html = await codeToHtml(code, {
        lang: 'typescript',
        themes: {
          light: 'catppuccin-latte',
          dark: 'dark-plus'
        },
        defaultColor: false,
      });
      setHighlightedCode(html);
    }
    highlightCode();
  }, [code]);

  return (
    <div 
      className="shiki h-full w-full overflow-auto"
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
}

export default ComponentPreview;
