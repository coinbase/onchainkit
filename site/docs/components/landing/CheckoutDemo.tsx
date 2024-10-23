import { Checkout, CheckoutButton } from '@coinbase/onchainkit/checkout';
import App from '../App.tsx';

export const checkoutDemoCode = `
  import { 
      Checkout, 
      CheckoutButton
  } from '@coinbase/onchainkit/checkout';
 
  <Checkout productId='my-product-id' > 
    <CheckoutButton coinbaseBranded/> 
  </Checkout>
`;

function CheckoutDemo() {
  return (
    <App>
      <Checkout productId="my-product-id">
        <CheckoutButton coinbaseBranded={true} className="px-6" />
      </Checkout>
    </App>
  );
}

export default CheckoutDemo;
