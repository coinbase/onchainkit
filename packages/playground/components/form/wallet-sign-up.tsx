import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useContext } from 'react';
import { AppContext } from '@/components/AppProvider';

export function WalletSignUp() {
  const { isSignUpEnabled, setIsSignUpEnabled } = useContext(AppContext);

  return (
    <div className="grid gap-2">
      <Label htmlFor="wallet-sign-up">Wallet Sign Up</Label>
      <RadioGroup
        id="wallet-sign-up"
        value={isSignUpEnabled ? 'enabled' : 'disabled'}
        className="flex items-center justify-between"
        onValueChange={(value) => setIsSignUpEnabled(value === 'enabled')}
      >
        <div className="flex items-center gap-2">
          <Label
            htmlFor="is-enabled-true"
            className="flex cursor-pointer items-center gap-2 rounded-md border p-2 [&:has(:checked)]:bg-muted"
          >
            <RadioGroupItem id="is-enabled-true" value="enabled" />
            Enabled
          </Label>
          <Label
            htmlFor="is-enabled-false"
            className="flex cursor-pointer items-center gap-2 rounded-md border p-2 [&:has(:checked)]:bg-muted"
          >
            <RadioGroupItem id="is-enabled-false" value="disabled" />
            Disabled
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
