import { useTheme } from '@/internal/hooks/useTheme';
import { background, border, cn, color } from '@/styles/theme';
import type { ReactNode } from 'react';
import { SendAmountInput } from './SendAmountInput';
import { SendButton } from './SendButton';
import { SendFundWallet } from './SendFundWallet';
import { SendHeader } from './SendHeader';
import { SendProvider, useSendContext } from './SendProvider';
import { SendTokenSelector } from './SendTokenSelector';
import { validateAmountInput } from '../utils/validateAmountInput';
import { SendAddressSelection } from '@/wallet/components/WalletAdvancedSend/components/SendAddressSelection';
import { getDefaultSendButtonLabel } from '@/wallet/components/WalletAdvancedSend/utils/getDefaultSendButtonLabel';
import { useWalletContext } from '@/wallet/components/WalletProvider';
import { useWalletAdvancedContext } from '@/wallet/components/WalletAdvancedProvider';

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
  const { chain: senderChain } = useWalletContext();
  const { tokenBalances } = useWalletAdvancedContext();
  const context = useSendContext();

  const walletNeedsFunding =
    context.isInitialized &&
    context.ethBalance &&
    context.ethBalance < 0.0000001;

  const disableSendButton = !validateAmountInput({
    cryptoAmount: context.cryptoAmount ?? '',
    selectedToken: context.selectedToken ?? undefined,
  });

  const buttonLabel = getDefaultSendButtonLabel(
    context.cryptoAmount,
    context.selectedToken,
  );

  console.log({
    context,
  });

  return (
    <>
      <SendHeader />
      {walletNeedsFunding ? (
        <SendFundWallet />
      ) : (
        <div className="flex h-full flex-col justify-between gap-4">
          <SendAddressSelection
            selectedRecipientAddress={context.selectedRecipientAddress}
            senderChain={senderChain}
            handleAddressSelection={context.handleAddressSelection}
            handleRecipientInputChange={context.handleRecipientInputChange}
          />
          {context.selectedRecipientAddress.value && !context.selectedToken && (
            <SendTokenSelector
              tokenBalances={tokenBalances}
              selectedToken={context.selectedToken}
              handleTokenSelection={context.handleTokenSelection}
              handleResetTokenSelection={context.handleResetTokenSelection}
              setSelectedInputType={context.setSelectedInputType}
              handleCryptoAmountChange={context.handleCryptoAmountChange}
              handleFiatAmountChange={context.handleFiatAmountChange}
            />
          )}
          {context.selectedRecipientAddress.value && context.selectedToken && (
            <>
              <SendAmountInput className="p-0" textClassName="text-4xl" />
              <SendTokenSelector
                tokenBalances={tokenBalances}
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
                senderChain={senderChain}
                callData={context.callData}
                onStatus={context.updateLifecycleStatus}
                disabled={disableSendButton}
                label={buttonLabel}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
