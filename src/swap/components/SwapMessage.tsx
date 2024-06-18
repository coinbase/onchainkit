import { useEffect, useState } from 'react';
import { useSwapContext } from '../context';
import { TextLabel2 } from '../../internal/text';

export function SwapMessage() {
  const [message, setMessage] = useState<string>('');
  const { error } = useSwapContext();
  useEffect(() => {
    if (!error) {
      setMessage('');
    } else if (error.code === -32602) {
      setMessage('Liquidity too low for the token');
    } else if (error.error) {
      setMessage(error.error);
    }
  }, [error]);
  return (
    <div className="flex">
      <TextLabel2 data-testid="ockSwapMessage_Message">{message}</TextLabel2>
    </div>
  );
}
