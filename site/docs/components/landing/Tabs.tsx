import React, { useState, ReactNode } from 'react';

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
    <div className="w-full">
      <div className="flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-2 px-4 ${
              activeTab === index
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-gray-700'
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
        : 'text-gray-500 hover:text-gray-700'
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
