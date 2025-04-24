import { useState, useEffect } from 'react';
import { FarcasterLogin } from '../../../../onchainkit/src/components/FarcasterLogin';
import { ConnectWallet, ConnectWalletText } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { isConnected } = useAccount();

  // Close the modal when a connection is established
  useEffect(() => {
    if (isConnected && isOpen) {
      onClose();
    }
  }, [isConnected, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded-lg w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl text-center font-regular mb-4">Choose Login Method</h2>
        <div className="flex flex-col gap-4 justify-center items-center">
          <p className="text-center text-sm text-gray-500">
            Login with your Coinbase Wallet to continue
          </p>
          <ConnectWallet 
            className="w-full bg-[#0052FF] text-white py-4 px-4 rounded-lg hover:bg-[#0040CC] transition-colors"
          >
            <ConnectWalletText>Coinbase Wallet</ConnectWalletText>
          </ConnectWallet>
          <div className="border-t border-gray-200 my-2" />
          <p className="text-center text-sm text-gray-500">
            Or login with Farcaster
          </p>
          <FarcasterLogin />
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
} 