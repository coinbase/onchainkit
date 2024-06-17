import { useContext, useEffect, useState } from 'react';
import { SwapContext } from '../context';
import { TextMessage } from '../../internal/text';

export function SwapMessage() {
  const [message, setMessage] = useState<string>('');
  const { error } = useContext(SwapContext);
  useEffect(() => {
    if (!error) {
      setMessage('');
    } else if (error.error) {
      setMessage(error.error);
    }
  }, [error]);
  return (
    <div>
      <TextMessage data-testid="ockSwapMessage_Text">{message}</TextMessage>
    </div>
  );
}
