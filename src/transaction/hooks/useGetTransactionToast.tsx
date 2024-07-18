import { useMemo } from 'react';
import { useTransactionContext } from '../components/TransactionProvider';
import { cn, color, text } from '../../styles/theme';
import { useOnchainKit } from '../../useOnchainKit';
import { getChainExplorer } from '../../network/getChainExplorer';
import { Spinner } from '../../internal/loading/Spinner';
import type { ReactNode } from 'react';

const successSVG = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Success SVG</title>
    <path
      d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM6.72667 11.5333L3.73333 8.54L4.67333 7.6L6.72667 9.65333L11.44 4.94L12.38 5.88L6.72667 11.5333Z"
      fill="#65A30D"
    />
  </svg>
);

const errorSVG = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Error SVG</title>
    <path
      d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58171 12.4183 0 8 0C3.58172 0 0 3.58171 0 8C0 12.4183 3.58172 16 8 16ZM11.7576 5.0909L8.84853 8L11.7576 10.9091L10.9091 11.7576L8 8.84851L5.09093 11.7576L4.2424 10.9091L7.15147 8L4.2424 5.0909L5.09093 4.24239L8 7.15145L10.9091 4.24239L11.7576 5.0909Z"
      fill="#E11D48"
    />
  </svg>
);

export function useGetTransactionToast() {
  const { onSubmit, status, transactionHash } = useTransactionContext();
  const { chain } = useOnchainKit();

  return useMemo(() => {
    const chainExplorer = getChainExplorer(chain.id);

    let actionElement: ReactNode = null;
    let label = '';
    let icon: ReactNode = null;

    if (status === 'pending') {
      actionElement = (
        // TODO: update with correct url
        <a href={chainExplorer}>
          <span className={cn(text.label1, color.primary)}>
            View block explorer
          </span>
        </a>
      );
      icon = <Spinner className="px-1.5 py-1.5" />;
      label = 'Transaction in progress';
    }
    if (transactionHash) {
      actionElement = (
        <a
          href={`${chainExplorer}/tx/${transactionHash}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className={cn(text.label1, color.primary)}>
            View transaction
          </span>
        </a>
      );
      icon = successSVG;
      label = 'Successful';
    }
    if (status === 'error') {
      actionElement = (
        <button type="button" onClick={onSubmit}>
          <span className={cn(text.label1, color.primary)}>Try again</span>
        </button>
      );
      icon = errorSVG;
      label = 'Something went wrong';
    }

    return { actionElement, icon, label };
  }, [chain, onSubmit, status, transactionHash]);
}
