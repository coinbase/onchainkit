import { useEffect, useState } from 'react';
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
};

const components: Component[] = [
  { name: 'Wallet', component: WalletDemo, code: walletDemoCode },
  { name: 'Swap', component: SwapDemo, code: swapDemoCode },
  { name: 'Checkout', component: CheckoutDemo, code: checkoutDemoCode },
  {
    name: 'Transaction',
    component: TransactionDemo,
    code: transactionDemoCode,
  },
  { name: 'Fund', component: FundDemo, code: fundDemoCode },
  { name: 'Identity', component: IdentityDemo, code: identityDemoCode },
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
    <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <ComponentList activeTab={activeTab} setActiveTab={setActiveTab} />
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

type ComponentListProps = {
  activeTab: number;
  setActiveTab: (index: number) => void;
};

function ComponentList({ activeTab, setActiveTab }: ComponentListProps) {
  return (
    <div className="w-full lg:w-[300px] lg:flex-shrink-0">
      <h3 className="pb-4 font-medium text-3xl text-zinc-900 dark:text-zinc-100">
        Ready-to-use components
      </h3>
      <div className="pb-6 text-lg text-zinc-700 dark:text-zinc-500">
        Accelerate your time-to-market with prebuilt components.
      </div>
      <div className="flex overflow-x-auto lg:flex-col lg:overflow-x-visible">
        {components.map((comp, index) => (
          <button
            type="button"
            key={comp.name}
            className={`flex-shrink-0 px-3 py-2 text-left text-base lg:text-lg ${
              activeTab === index
                ? 'rounded-lg bg-zinc-100 font-semibold text-indigo-600 dark:bg-[#0F0F0F] dark:text-indigo-400'
                : 'text-zinc-700 hover:rounded-lg hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-[#0F0F0F]'
            } mr-2 lg:mr-0 lg:mb-2`}
            onClick={() => setActiveTab(index)}
          >
            {comp.name}
          </button>
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
    <div className="w-full rounded-lg border-[1px] border-zinc-200 lg:w-[800px] lg:flex-shrink-0 dark:border-zinc-900">
      <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-zinc-100 lg:h-[600px] dark:bg-[#0F0F0F]">
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
        <div className="h-[calc(100%-40px)] overflow-auto px-4">
          <div
            className={`${activeSubTab === 'preview' ? 'flex' : 'hidden'} h-full items-center justify-center py-4`}
          >
            <div className="flex h-full w-full items-center justify-center overflow-auto">
              <ActiveComponent />
            </div>
          </div>
          <div
            className={`${activeSubTab === 'code' ? 'block' : 'hidden'} relative h-full`}
          >
            <pre className="h-full w-full overflow-auto bg-zinc-100 py-4 text-sm dark:bg-[#0F0F0F]">
              <code>{components[activeTab].code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComponentPreview;
