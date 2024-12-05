import { Checkout } from '@coinbase/onchainkit/checkout';
import { useCallback, useState } from 'react';
import App from '../App.tsx';
import { closeSvg } from '../svg/closeSvg.tsx';
import { coinbasePaySvg } from '../svg/coinbasePaySvg.tsx';

export const checkoutDemoCode = `
  import {
      Checkout,
      CheckoutButton
  } from '@coinbase/onchainkit/checkout';

  function CheckoutDemo() {
    return (
      <Checkout productId='my-product-id' >
        <CheckoutButton coinbaseBranded={true}/>
      </Checkout>
    )
  }
  `;

const GITHUB_LINK = 'https://github.com/coinbase/onchain-commerce-template';

function CheckoutDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <App>
      <Checkout productId="my-product-id">
        {isModalOpen && <CheckoutModal closeModal={closeModal} />}
        <MockCheckoutButton onClick={openModal} />
      </Checkout>
    </App>
  );
}

function CheckoutModal({ closeModal }: { closeModal: () => void }) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative z-10 flex h-auto max-w-3xl flex-col gap-2 rounded-lg xs:rounded-[10px] border border-zinc-300 bg-[#f4f4f5] p-10 sm:px-10 dark:border-zinc-700 dark:bg-[#0f0f0f]">
        <button
          type="button"
          className="absolute top-4 right-4"
          onClick={closeModal}
        >
          {closeSvg}
        </button>
        <div className="flex flex-col items-start gap-2 pb-4">
          <div className="font-bold text-lg">Try it locally</div>
          <span className="pb-4 text-sm">
            <a
              href={GITHUB_LINK}
              className="ock-text-primary"
              target="_blank"
              rel="noreferrer"
            >
              Fork the Onchain Commerce Template to experience the end-to-end
              checkout flow.{' '}
            </a>
            Your users will see the below flow when checkout is enabled.
          </span>
          <img
            alt="Checkout"
            src="https://onchainkit.xyz/assets/checkout.gif"
            height="364"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

function MockCheckoutButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="w-64">
      <div className="default-dark flex w-full flex-col gap-2">
        <button
          type="button"
          onClick={onClick}
          className="active:ock-bg-secondary-active ock-border-radius ock-font-family flex w-full cursor-pointer items-center justify-center bg-[#0052FF] px-4 py-3 font-semibold leading-normal hover:bg-[#0045D8]"
        >
          <div className="flex items-center justify-center whitespace-nowrap">
            <div className="mr-2 flex h-5 w-5 shrink-0 items-center justify-center">
              {coinbasePaySvg}
            </div>
          </div>
          <span className="ock-font-family font-semibold text-gray-50 leading-normal">
            Pay with Crypto
          </span>
        </button>
      </div>
    </div>
  );
}

export default CheckoutDemo;
