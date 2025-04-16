import { useState, useCallback, useEffect } from 'react';
import { Step } from '../Step';
import { useAccount } from 'wagmi';
import { validateUrl } from '../../utilities/validateUrl';

const DEBOUNCE_TIME = 500;

type DomainProps = {
  description: string;
  handleSetDomain: (domain: string) => void;
  requireValid?: boolean;
  showHttpError?: boolean;
  error?: string;
};

export function Domain({
  description,
  handleSetDomain,
  requireValid = false,
  showHttpError = true,
  error,
}: DomainProps) {
  const [domain, setDomain] = useState<string>('');
  const [showDomainError, setShowDomainError] = useState<boolean>(false);
  const { address } = useAccount();

  const validateDomain = useCallback(() => {
    if (!domain) {
      return;
    }
    const isValid = validateUrl(domain);
    setShowDomainError(!isValid);

    if (!requireValid || isValid) {
      handleSetDomain(domain);
    }
  }, [domain, handleSetDomain, requireValid]);

  useEffect(() => {
    const timer = setTimeout(validateDomain, DEBOUNCE_TIME);
    return () => clearTimeout(timer);
  }, [validateDomain]);

  const handleDomainChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDomain(e.target.value);
      setShowDomainError(false);
    },
    [],
  );

  return (
    <Step
      number={2}
      label="Enter the domain of your app"
      disabled={!address}
      description={description}
    >
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Enter the domain"
          className="rounded border border-gray-300 px-4 py-2"
          value={domain}
          onChange={handleDomainChange}
          onBlur={validateDomain}
        />
        {(showDomainError || error) && (
          <>
            <p className="text-red-500">
              {error ?? 'Please enter a valid domain, e.g. https://example.com'}
            </p>
            {showHttpError && /http:/.test(domain) && (
              <p className="text-sm pl-5 -indent-3 text-gray-600 bg-gray-100 rounded-md pt-2 pb-2 pr-2 border">
                * http domains are not valid for production, when you are ready
                to deploy you can regenerate your Mini-App manifest by running{' '}
                <i className="text-gray-600">npx create-onchain --manifest</i>{' '}
                in your project directory.
              </p>
            )}
          </>
        )}
      </div>
    </Step>
  );
}
