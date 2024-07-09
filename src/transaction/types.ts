// 🌲☀🌲
import type { ReactNode } from 'react';

/**
 * Note: exported as public Type
 */
export type TransactionContextType = {
  error?: TransactionErrorState;
  loading: boolean;
};

/**
 * Note: exported as public Type
 */
export type TransactionError = {
  code: string; // The error code
  error: string; // The error message
};

export type TransactionErrorState = {
  TransactionError?: TransactionError;
};

/**
 * Note: exported as public Type
 */
export type TransactionReact = {
  children: ReactNode;
};
