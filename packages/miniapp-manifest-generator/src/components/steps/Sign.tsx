import { useFid } from '../../hooks/useFid';
import { Step } from '../Step';
import { useAccount } from 'wagmi';
import { useSignManifest } from '../../hooks/useSignManifest';
import { AccountAssociation } from '../../types';

export type SignProps = {
  domain: string;
  handleSigned: (accountAssociation: AccountAssociation) => void;
};

export function Sign({ domain, handleSigned }: SignProps) {
  const { address } = useAccount();

  const fid = useFid(address);
  const { isPending, error, generateAccountAssociation } = useSignManifest({
    domain,
    fid,
    address,
    onSigned: handleSigned,
  });

  return (
    <Step
      number={3}
      label="Sign to generate and save your Mini-App manifeset"
      disabled={!address || !domain || fid === 0}
      description="The Mini-App manifest will be saved to your .env file as `FARCASTER_HEADER`, `FARCASTER_PAYLOAD` and `FARCASTER_SIGNATURE` variables"
    >
      <div className="flex flex-col gap-2">
        {fid === 0 ? (
          <p className="text-red-500">
            There is no FID associated with this account, please connect with
            your Farcaster custody account.
          </p>
        ) : (
          <p>Your FID is {fid}</p>
        )}

        <button
          type="button"
          disabled={!address || !domain || fid === 0}
          onClick={generateAccountAssociation}
          className={`w-fit rounded px-6 py-2 text-white ${
            !address || !domain || fid === 0
              ? '!bg-blue-200'
              : '!bg-blue-800 hover:!bg-blue-600'
          }`}
        >
          {isPending ? 'Signing...' : 'Sign'}
        </button>
        {error && (
          <p className="text-red-500">
            {error.message.split('\n').map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </p>
        )}
      </div>
    </Step>
  );
}
