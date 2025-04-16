import { useEffect, useState } from 'react';
import {
  useValidateManifest,
  type ValidateManifestResult,
} from '../hooks/useValidateManifest';
import { AccountAssociation } from '../types';

type ValidateAccountAssociationProps = {
  accountAssociation: AccountAssociation;
};

export function ValidateAccountAssociation({
  accountAssociation,
}: ValidateAccountAssociationProps) {
  const validateManifest = useValidateManifest();
  const [result, setResult] = useState<ValidateManifestResult>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function validate() {
      try {
        const result = await validateManifest(accountAssociation);
        setResult(result);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Manifest validation failed',
        );
      }
    }

    validate();
  }, [accountAssociation, validateManifest]);

  return (
    <div className="flex flex-col gap-2 text-gray-500">
      {!result && !error && <p>Validating account association...</p>}
      {result && (
        <>
          <p>
            <span className="font-bold">Signer FID:</span> {result.fid}
          </p>
          <p>
            <span className="font-bold">Signer Custody Address:</span>{' '}
            {result.custodyAddress}
          </p>
          <p>
            <span className="font-bold">Signed Domain:</span> {result.domain}
          </p>
          <p className="text-green-500">
            ✅ Your account association is valid!
          </p>
        </>
      )}
      {error && <p>❌ {error}</p>}
    </div>
  );
}
