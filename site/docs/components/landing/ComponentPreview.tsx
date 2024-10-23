import React, { ReactNode, useState } from 'react';
import WalletDemo, { walletDemoCode } from './WalletDemo.tsx';
import SwapDemo, { swapDemoCode } from './SwapDemo.tsx';
import TransactionDemo, { transactionDemoCode } from './TransactionDemo.tsx';
import FundDemo, { fundDemoCode } from './FundDemo.tsx';
import IdentityDemo, { identityDemoCode } from './IdentityDemo.tsx';
import CopyIcon from '../svg/CopySvg.tsx';

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
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-1 px-3 mx-0.5 ${
              activeTab === index
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 rounded-lg'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg'
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

export const TabsTrigger = ({
  children,
  isActive,
  onClick,
}: {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    className={`py-2 px-4 ${
      isActive
        ? 'border-b-2 border-blue-500 text-blue-500'
        : 'text-zinc-500 hover:text-zinc-700'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
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
  lines.forEach((line) => {
    if (line.trim().startsWith('import')) {
      const matches = line.match(/\{([^}]+)\}/);
      if (matches) {
        matches[1].split(',').forEach((component) => {
          customComponents.add(component.trim());
        });
      }
    }
  });

  return lines.map((line, lineIndex) => (
    <React.Fragment key={lineIndex}>
      {line
        .split(/(<.+?>|{.+?}|\s+)/)
        .filter(Boolean)
        .map((part, partIndex) => {
          if (part.trim().startsWith('//')) {
            return (
              <span
                key={partIndex}
                className="text-green-500 dark:text-green-400"
              >
                {part}
              </span>
            );
          } else if (part.trim().startsWith('import')) {
            return (
              <span
                key={partIndex}
                className="text-purple-500 dark:text-purple-400"
              >
                {part}
              </span>
            );
          } else if (part.startsWith('<') && part.endsWith('>')) {
            const [tagName, ...attributes] = part.slice(1, -1).split(/\s+/);
            return (
              <span key={partIndex}>
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
                {attributes.map((attr, attrIndex) => {
                  const [attrName, ...attrValueParts] = attr.split('=');
                  const attrValue = attrValueParts.join('=');
                  return (
                    <span key={attrIndex}>
                      {' '}
                      <span className="text-cyan-500 dark:text-cyan-400">
                        {attrName}
                      </span>
                      {attrValue && (
                        <>
                          <span className="text-zinc-500 dark:text-zinc-400">
                            {'='}
                          </span>
                          <span className="text-orange-500 dark:text-orange-400">
                            {attrValue}
                          </span>
                        </>
                      )}
                    </span>
                  );
                })}
                <span className="text-blue-500 dark:text-blue-400">{'>'}</span>
              </span>
            );
          } else if (part.startsWith('{') && part.endsWith('}')) {
            return (
              <span
                key={partIndex}
                className="text-cyan-500 dark:text-cyan-400"
              >
                {part}
              </span>
            );
          } else if (customComponents.has(part)) {
            return (
              <span
                key={partIndex}
                className="text-yellow-500 dark:text-yellow-400"
              >
                {part}
              </span>
            );
          } else if (/^[A-Z][a-zA-Z]*$/.test(part)) {
            return (
              <span
                key={partIndex}
                className="text-teal-500 dark:text-teal-400"
              >
                {part}
              </span>
            );
          } else if (/^[a-z][a-zA-Z]*$/.test(part)) {
            return (
              <span
                key={partIndex}
                className="text-cyan-500 dark:text-cyan-400"
              >
                {part}
              </span>
            );
          }
          return <span key={partIndex}>{part}</span>;
        })}
      <br />
    </React.Fragment>
  ));
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
    <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div className="w-full lg:w-[300px] lg:flex-shrink-0">
          <h3 className="text-3xl text-zinc-900 dark:text-zinc-100 pb-4 font-medium">
            Ready-to-use components
          </h3>
          <p className="text-base lg:text-lg text-zinc-700 dark:text-zinc-500 pb-6">
            Components that abstract away onchain development complexity.
          </p>
          <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-x-visible">
            {components.map((comp, index) => (
              <button
                key={index}
                className={`mt-2 py-2 px-3 text-left text-base lg:text-lg whitespace-nowrap lg:whitespace-normal ${
                  activeTab === index
                    ? 'bg-zinc-100 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 rounded-lg font-semibold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:rounded-lg'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {comp.name}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-[800px] lg:flex-shrink-0 border-[1px] rounded-lg border-zinc-200 dark:border-zinc-800">
          <div className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-lg relative h-[400px] lg:h-[600px] overflow-hidden">
            <div className="flex border-b border-zinc-200 dark:border-zinc-800">
              <button
                className={`py-2 px-4 mt-2 ml-2 text-sm ${
                  activeSubTab === 'preview'
                    ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 border-b-2 border-indigo-600 dark:border-indigo-400'
                    : 'text-zinc-700 dark:text-zinc-300'
                }`}
                onClick={() => setActiveSubTab('preview')}
              >
                Preview
              </button>
              <button
                className={`py-2 px-4 mt-2 text-sm ${
                  activeSubTab === 'code'
                    ? 'text-zinc-950 dark:text-zinc-50 border-b-2 border-indigo-600 dark:border-indigo-400'
                    : 'text-zinc-700 dark:text-zinc-300'
                }`}
                onClick={() => setActiveSubTab('code')}
              >
                Code
              </button>
            </div>
            <div className="h-[calc(100%-40px)] overflow-auto">
              <div
                className={`${activeSubTab === 'preview' ? 'flex' : 'hidden'} p-4 h-full items-center justify-center`}
              >
                <div className="w-full h-full flex items-center justify-center overflow-auto">
                  <ActiveComponent />
                </div>
              </div>
              <div
                className={`${activeSubTab === 'code' ? 'block' : 'hidden'} h-full`}
              >
                <button
                  className="absolute top-2 right-2 p-1 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                  onClick={() =>
                    copyToClipboard(components[activeTab].code, activeTab)
                  }
                  title="Copy to clipboard"
                >
                  <CopyIcon className="text-zinc-700 dark:text-zinc-300" />
                </button>
                {copiedIndex === activeTab && (
                  <div className="absolute top-2 right-10 bg-zinc-200 dark:bg-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 px-2 py-1 rounded-md">
                    Copied!
                  </div>
                )}
                <pre className="text-zinc-900 dark:text-zinc-100 p-4 h-full w-full overflow-auto">
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
