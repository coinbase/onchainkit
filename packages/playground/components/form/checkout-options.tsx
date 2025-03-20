import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckoutTypes } from '@/types/onchainkit';
import { useContext } from 'react';
import { useState } from 'react';
import { AppContext } from '../AppProvider';

export function CheckoutOptions() {
  const {
    checkoutTypes,
    setCheckoutTypes,
    checkoutOptions,
    setCheckoutOptions,
  } = useContext(AppContext);

  const [productId, setProductId] = useState<string>(
    checkoutOptions?.productId || '',
  );
  const [productOptions, setProductOptions] = useState<{
    chargeId: string;
  }>({
    chargeId: checkoutOptions?.chargeId || '',
  });

  return (
    <div className="grid gap-2">
      <Label htmlFor="chain">Checkout Types</Label>
      <RadioGroup
        id="pay-type"
        value={checkoutTypes}
        className="flex items-center justify-between"
        onValueChange={(value) => setCheckoutTypes?.(value as CheckoutTypes)}
      >
        <div className="flex items-center gap-2">
          <Label
            htmlFor="pay-type-product-id"
            className="flex cursor-pointer items-center gap-2 rounded-md border p-2 [&:has(:checked)]:bg-muted"
          >
            <RadioGroupItem
              id="pay-type-product-id"
              value={CheckoutTypes.ProductID}
            />
            Product ID
          </Label>
          <Label
            htmlFor="pay-type-charge-id"
            className="flex cursor-pointer items-center gap-2 rounded-md border p-2 [&:has(:checked)]:bg-muted"
          >
            <RadioGroupItem
              id="pay-type-charge-id"
              value={CheckoutTypes.ChargeID}
            />
            Charge ID
          </Label>
        </div>
      </RadioGroup>

      {checkoutTypes === CheckoutTypes.ChargeID && (
        <div>
          <Label htmlFor="charge-id">Charge ID</Label>
          <Input
            id="charge-id"
            value={productOptions.chargeId}
            placeholder="Enter Charge ID"
            onChange={(e) => {
              setProductOptions({
                ...productOptions,
                chargeId: e.target.value,
              });
              setCheckoutOptions?.({
                ...checkoutOptions,
                chargeId: e.target.value,
              });
            }}
          />
        </div>
      )}
      {checkoutTypes === CheckoutTypes.ProductID && (
        <div>
          <Label htmlFor="product-id">Product ID</Label>
          <Input
            id="product-id"
            placeholder="Enter Product ID"
            value={productId}
            onChange={(e) => {
              setProductId(e.target.value);
              setCheckoutOptions?.({
                ...checkoutOptions,
                productId: e.target.value,
              });
            }}
          />
        </div>
      )}
    </div>
  );
}
