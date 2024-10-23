import React, { type ReactNode, useState } from 'react';
import CopyIcon from '../svg/CopySvg.tsx';
import FundDemo, { fundDemoCode } from './FundDemo.tsx';
import IdentityDemo, { identityDemoCode } from './IdentityDemo.tsx';
import SwapDemo, { swapDemoCode } from './SwapDemo.tsx';
import TransactionDemo, { transactionDemoCode } from './TransactionDemo.tsx';
import WalletDemo, { walletDemoCode } from './WalletDemo.tsx';

// Tabs
interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="flex">
        {tabs.map((tab, index) => (
          <button
            key={`tab-${tab.label}`}
            type="button"
            className={`mx-0.5 px-3 py-1 ${
              activeTab === index
                ? 'rounded-lg bg-white text-indigo-600 dark:bg-zinc-800 dark:text-indigo-400'
                : 'rounded-lg text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{tabs[activeTab].content}</div>
    </div>
  );
}

export const TabsList = ({ children }: { children: ReactNode }) => (
  <div className="flex border-b">{children}</div>
);

export const TabsContent = ({
  children,
  isActive,
}: {
  children: ReactNode;
  isActive: boolean;
}) => (isActive ? <div className="mt-4">{children}</div> : null);

const components = [
  { name: 'Wallet', component: WalletDemo, code: walletDemoCode },
  { name: 'Swap', component: SwapDemo, code: swapDemoCode },
  {
    name: 'Transaction',
    component: TransactionDemo,
    code: transactionDemoCode,
  },
  { name: 'Fund', component: FundDemo, code: fundDemoCode },
  { name: 'Identity', component: IdentityDemo, code: identityDemoCode },
];

// Highlight JSX code
function highlightJSX(code: string): React.ReactNode {
  const lines = code.split('\n');
  const customComponents = new Set<string>();

  // First pass: collect custom component names from import statements
  for (const line of lines) {
    if (line.trim().startsWith('import')) {
      const matches = line.match(/\{([^}]+)\}/);
      if (matches) {
        for (const component of matches[1].split(',')) {
          customComponents.add(component.trim());
        }
      }
    }
  }

  return lines.map((line, lineIndex) => (
    <React.Fragment key={`line-${line.trim().substring(0, 10)}-${lineIndex}`}>
      {line
        .split(/(<.+?>|{.+?}|\s+)/)
        .filter(Boolean)
        .map((part, partIndex) =>
          renderPart(part, lineIndex, partIndex, customComponents),
        )}
      <br />
    </React.Fragment>
  ));
}

function renderPart(
  part: string,
  lineIndex: number,
  partIndex: number,
  customComponents: Set<string>,
): React.ReactNode {
  const partKey = `${part.trim().substring(0, 10)}-${lineIndex}-${partIndex}`;

  if (part.trim().startsWith('//')) {
    return (
      <span key={partKey} className="text-green-500 dark:text-green-400">
        {part}
      </span>
    );
  }
  if (part.trim().startsWith('import')) {
    return (
      <span key={partKey} className="text-purple-500 dark:text-purple-400">
        {part}
      </span>
    );
  }
  if (part.startsWith('<') && part.endsWith('>')) {
    return renderJSXTag(part, partKey, customComponents);
  }
  if (part.startsWith('{') && part.endsWith('}')) {
    return (
      <span key={partKey} className="text-cyan-500 dark:text-cyan-400">
        {part}
      </span>
    );
  }
  if (customComponents.has(part)) {
    return (
      <span key={partKey} className="text-yellow-500 dark:text-yellow-400">
        {part}
      </span>
    );
  }
  if (/^[A-Z][a-zA-Z]*$/.test(part)) {
    return (
      <span key={partKey} className="text-teal-500 dark:text-teal-400">
        {part}
      </span>
    );
  }
  if (/^[a-z][a-zA-Z]*$/.test(part)) {
    return (
      <span key={partKey} className="text-cyan-500 dark:text-cyan-400">
        {part}
      </span>
    );
  }
  return <span key={partKey}>{part}</span>;
}

function renderJSXTag(
  part: string,
  partKey: string,
  customComponents: Set<string>,
): React.ReactNode {
  const [tagName, ...attributes] = part.slice(1, -1).split(/\s+/);
  return (
    <span key={partKey}>
      <span className="text-blue-500 dark:text-blue-400">{'<'}</span>
      <span
        className={
          customComponents.has(tagName)
            ? 'text-yellow-500 dark:text-yellow-400'
            : tagName[0] === tagName[0].toUpperCase()
              ? 'text-teal-500 dark:text-teal-400'
              : 'text-blue-500 dark:text-blue-400'
        }
      >
        {tagName}
      </span>
      {attributes.map(renderAttribute)}
      <span className="text-blue-500 dark:text-blue-400">{'>'}</span>
    </span>
  );
}

function renderAttribute(attr: string): React.ReactNode {
  const [attrName, ...attrValueParts] = attr.split('=');
  const attrValue = attrValueParts.join('=');
  return (
    <span key={`${attrName}-${attrValue}`}>
      {' '}
      <span className="text-cyan-500 dark:text-cyan-400">{attrName}</span>
      {attrValue && (
        <>
          <span className="text-zinc-500 dark:text-zinc-400">{'='}</span>
          <span className="text-orange-500 dark:text-orange-400">
            {attrValue}
          </span>
        </>
      )}
    </span>
  );
}

function ComponentPreview() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<'preview' | 'code'>(
    'preview',
  );

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const ActiveComponent = components[activeTab].component;

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div className="w-full lg:w-[300px] lg:flex-shrink-0">
          <h3 className="pb-4 font-medium text-3xl text-zinc-900 dark:text-zinc-100">
            Ready-to-use components
          </h3>
          <p className="pb-6 text-base text-zinc-700 lg:text-lg dark:text-zinc-500">
            Accelerate your time-to-market with prebuilt components.
          </p>
          <div className="flex flex-row space-x-2 overflow-x-auto lg:flex-col lg:space-x-0 lg:space-y-2 lg:overflow-x-visible">
            {components.map((comp, index) => (
              <button
                type="button"
                key={comp.name}
                className={`mt-2 whitespace-nowrap px-3 py-2 text-left text-base lg:whitespace-normal lg:text-lg ${
                  activeTab === index
                    ? 'rounded-lg bg-zinc-100 font-semibold text-indigo-600 dark:bg-zinc-900 dark:text-indigo-400'
                    : 'text-zinc-700 hover:rounded-lg hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {comp.name}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full rounded-lg border-[1px] border-zinc-200 lg:w-[800px] lg:flex-shrink-0 dark:border-zinc-800">
          <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-zinc-100 lg:h-[600px] dark:bg-zinc-900">
            <div className="flex border-zinc-200 border-b dark:border-zinc-800">
              <button
                type="button"
                className={`mt-2 ml-2 px-4 py-2 text-sm ${
                  activeSubTab === 'preview'
                    ? 'border-indigo-600 border-b-2 bg-zinc-100 text-zinc-950 dark:border-indigo-400 dark:bg-zinc-900 dark:text-zinc-50'
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
            <div className="h-[calc(100%-40px)] overflow-auto">
              <div
                className={`${activeSubTab === 'preview' ? 'flex' : 'hidden'} h-full items-center justify-center p-4`}
              >
                <div className="flex h-full w-full items-center justify-center overflow-auto">
                  <ActiveComponent />
                </div>
              </div>
              <div
                className={`${activeSubTab === 'code' ? 'block' : 'hidden'} h-full`}
              >
                <button
                  type="button"
                  className="absolute top-2 right-2 rounded-md p-1 transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-600"
                  onClick={() =>
                    copyToClipboard(components[activeTab].code, activeTab)
                  }
                  title="Copy to clipboard"
                >
                  <CopyIcon className="text-zinc-700 dark:text-zinc-300" />
                </button>
                {copiedIndex === activeTab && (
                  <div className="absolute top-2 right-10 rounded-md bg-zinc-200 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                    Copied!
                  </div>
                )}
                <pre className="h-full w-full overflow-auto p-4 text-zinc-900 dark:text-zinc-100">
                  <code className="block whitespace-pre text-sm">
                    {highlightJSX(components[activeTab].code)}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComponentPreview;
