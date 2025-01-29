import { useTheme } from '@/internal/hooks/useTheme';
import { background, border, cn, color } from '@/styles/theme';
import { type ReactNode, useMemo } from 'react';
import { SendAddressInput } from './SendAddressInput';
import { SendAddressSelector } from './SendAddressSelector';
import { SendAmountInput } from './SendAmountInput';
import { SendButton } from './SendButton';
import { SendFundingWallet } from './SendFundingWallet';
import { SendHeader } from './SendHeader';
import { SendProvider, useSendContext } from './SendProvider';
import { SendTokenSelector } from './SendTokenSelector';

type SendReact = {
  children?: ReactNode;
  className?: string;
};

export function Send({
  children = <SendDefaultChildren />,
  className,
}: SendReact) {
  const componentTheme = useTheme();

  return (
    <SendProvider>
      <div
        className={cn(
          componentTheme,
          background.default,
          border.radius,
          border.lineDefault,
          color.foreground,
          'h-96 w-88',
          'flex flex-col',
          'p-4',
          className,
        )}
      >
        {children}
      </div>
    </SendProvider>
  );
}

function SendDefaultChildren() {
  const context = useSendContext();

  console.log({
    context,
  });

  const activeStep = useMemo(() => {
    if (!context.isInitialized) {
      return null;
    }

    if (!context.ethBalance || context.ethBalance < 0.0000001) {
      return <SendFundingWallet />;
    }

    if (!context.selectedRecipientAddress) {
      return (
        <>
          <SendAddressInput
            // senderChain={context.senderChain}
            selectedRecipientAddress={context.selectedRecipientAddress}
            recipientInput={context.recipientInput}
            setRecipientInput={context.setRecipientInput}
            handleRecipientInputChange={context.handleRecipientInputChange}
          />
          {context.validatedRecipientAddress && (
            <SendAddressSelector
              address={context.validatedRecipientAddress}
              senderChain={context.senderChain}
              handleAddressSelection={context.handleAddressSelection}
            />
          )}
        </>
      );
    }

    if (!context.selectedToken) {
      return (
        <>
          <SendAddressInput
            // senderChain={context.senderChain}
            selectedRecipientAddress={context.selectedRecipientAddress}
            recipientInput={context.recipientInput}
            setRecipientInput={context.setRecipientInput}
            handleRecipientInputChange={context.handleRecipientInputChange}
          />
          <SendTokenSelector
            tokenBalances={context.tokenBalances}
            selectedToken={context.selectedToken}
            handleTokenSelection={context.handleTokenSelection}
            handleResetTokenSelection={context.handleResetTokenSelection}
            setSelectedInputType={context.setSelectedInputType}
            handleCryptoAmountChange={context.handleCryptoAmountChange}
            handleFiatAmountChange={context.handleFiatAmountChange}
          />
        </>
      );
    }

    return (
      <div className="flex h-full flex-col justify-between gap-4">
        <SendAddressInput
          // senderChain={context.senderChain}
          selectedRecipientAddress={context.selectedRecipientAddress}
          recipientInput={context.recipientInput}
          setRecipientInput={context.setRecipientInput}
          handleRecipientInputChange={context.handleRecipientInputChange}
        />
        <SendAmountInput className="p-0" textClassName="text-4xl" />
        <SendTokenSelector
          tokenBalances={context.tokenBalances}
          selectedToken={context.selectedToken}
          handleTokenSelection={context.handleTokenSelection}
          handleResetTokenSelection={context.handleResetTokenSelection}
          setSelectedInputType={context.setSelectedInputType}
          handleCryptoAmountChange={context.handleCryptoAmountChange}
          handleFiatAmountChange={context.handleFiatAmountChange}
        />
        <SendButton
          cryptoAmount={context.cryptoAmount}
          selectedToken={context.selectedToken}
          callData={context.callData}
          sendTransactionError={context.sendTransactionError}
        />
      </div>
    );
  }, [
    context.isInitialized,
    context.ethBalance,
    context.selectedRecipientAddress,
    context.selectedToken,
    context.validatedRecipientAddress,
    context.tokenBalances,
    context.setSelectedInputType,
    context.handleTokenSelection,
    context.handleResetTokenSelection,
    context.handleCryptoAmountChange,
    context.handleFiatAmountChange,
    context.handleRecipientInputChange,
    context.handleAddressSelection,
    context.recipientInput,
    context.setRecipientInput,
    context.senderChain,
    context.cryptoAmount,
    context.callData,
    context.sendTransactionError,
  ]);

  return (
    <>
      <SendHeader />
      {activeStep}
    </>
  );
}
