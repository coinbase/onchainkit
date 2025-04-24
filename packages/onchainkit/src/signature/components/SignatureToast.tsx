import { useCallback, useEffect, useState } from 'react';
import { Toast, type ToastProps } from '../../internal/components/Toast';
import { SignatureIcon } from './SignatureIcon';
import { SignatureLabel } from './SignatureLabel';
import { useSignatureContext } from './SignatureProvider';

const DEFAULT_CHILDREN = (
  <>
    <SignatureIcon />
    <SignatureLabel />
  </>
);

type SignatureToastProps = {
  children?: React.ReactNode;
  className?: string;
  durationMs?: ToastProps['durationMs'];
  position?: ToastProps['position'];
};

export function SignatureToast({
  children = DEFAULT_CHILDREN,
  className,
  durationMs = 5000,
  position = 'bottom-center',
}: SignatureToastProps) {
  const { lifecycleStatus } = useSignatureContext();
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    if (lifecycleStatus.statusName !== 'init') {
      setIsToastVisible(true);
    }
  }, [lifecycleStatus]);

  const closeToast = useCallback(() => {
    setIsToastVisible(false);
  }, []);

  return (
    <Toast
      position={position}
      className={className}
      durationMs={durationMs}
      isVisible={isToastVisible}
      onClose={closeToast}
      startTimeout={
        lifecycleStatus.statusName === 'error' ||
        lifecycleStatus.statusName === 'success'
      }
    >
      {children}
    </Toast>
  );
}
