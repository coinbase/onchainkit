import React, { createContext, useState, useContext, ReactNode } from 'react';

type TextInputsContextType = {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
};

const TextInputsContext = createContext<TextInputsContextType | undefined>(
  undefined
);

type TextInputsProviderProps = {
  children?: ReactNode;
};

export default function TextInputsProvider({
  children,
}: TextInputsProviderProps) {
  const [inputText, setInputText] = useState<string>('');

  return (
    <TextInputsContext.Provider value={{ inputText, setInputText }}>
      {children}
    </TextInputsContext.Provider>
  );
}

export function useTextInputs() {
  const context = useContext(TextInputsContext);
  if (context === undefined) {
    throw new Error('useTextInputs must be used within a TextInputsProvider');
  }
  return context;
}
