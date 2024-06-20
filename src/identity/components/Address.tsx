import { useIdentityContext } from '../context';
import { getSlicedAddress } from '../getSlicedAddress';
import { cn, text } from '../../styles/theme';

type AddressReact = {
  className: string;
};

export function Address({ className }: AddressReact) {
  const { address } = useIdentityContext();
  return (
    <span className={cn(text.label2, className)}>
      {getSlicedAddress(address)}
    </span>
  );
}
