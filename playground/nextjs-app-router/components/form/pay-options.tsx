import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useContext } from 'react';
import { useState } from 'react';
import { AppContext, OnchainKitComponent, PayTypes } from '../AppProvider';

export function PayOptions() {
  const { activeComponent, payTypes, setPayTypes, payOptions, setPayOptions } =
    useContext(AppContext);

  const [productId, setProductId] = useState<string>(
    payOptions?.productId || ''
  );
  const [productOptions, setProductOptions] = useState<{
    chargeId: string;
  }>({
    chargeId: '',
  });

  return (
    activeComponent === OnchainKitComponent.Pay && (
      <div className="grid gap-2">
        <Label htmlFor="chain">Pay Types</Label>
        <RadioGroup
          id="pay-type"
          value={payTypes}
          className="flex items-center justify-between"
          onValueChange={(value) => setPayTypes?.(value as PayTypes)}
        >
          <div className="flex items-center gap-2">
            <Label
              htmlFor="pay-type-product-id"
              className="flex cursor-pointer items-center gap-2 rounded-md border p-2 [&:has(:checked)]:bg-muted"
            >
              <RadioGroupItem
                id="pay-type-product-id"
                value={PayTypes.ProductID}
              />
              Product ID
            </Label>
            <Label
              htmlFor="pay-type-charge-id"
              className="flex cursor-pointer items-center gap-2 rounded-md border p-2 [&:has(:checked)]:bg-muted"
            >
              <RadioGroupItem
                id="pay-type-charge-id"
                value={PayTypes.ChargeID}
              />
              Charge ID
            </Label>
          </div>
        </RadioGroup>

        {payTypes === PayTypes.ChargeID && (
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
                setPayOptions?.({ ...payOptions, chargeId: e.target.value });
              }}
            />
          </div>
        )}
        {payTypes === PayTypes.ProductID && (
          <div>
            <Label htmlFor="product-id">Product ID</Label>
            <Input
              id="product-id"
              placeholder="Enter Product ID"
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
                setPayOptions?.({ ...payOptions, productId: e.target.value });
              }}
            />
          </div>
        )}
      </div>
    )
  );
}
