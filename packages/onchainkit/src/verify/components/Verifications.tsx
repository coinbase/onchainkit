import { useQuery } from '@tanstack/react-query';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

const BASE_VERIFY_URL =
  'https://base-privacy-verify-mvp-786bd21ac1f0.herokuapp.com';

interface ProviderInfo {
  traits: Record<string, unknown>;
  nullifier: string;
}

interface Identity {
  nullifier: string;
  traits: Record<string, unknown>;
  provider: string;
  signature: string;
  timestamp: number;
}

interface Verification {
  id: string;
  provider: string;
  provider_info: ProviderInfo;
  identity: Identity;
  created_at: string;
  revoked_at: string | null;
}

interface VerificationData {
  isVerified: boolean;
  verifications: Verification[];
}

interface VerificationResponse {
  status: string;
  data: VerificationData;
}

function useVerifications({ address }: { address?: Address }) {
  return useQuery<VerificationResponse | undefined>({
    queryKey: ['verifications', address],
    queryFn: async () => {
      if (!address) return;

      const response = await fetch(
        `${BASE_VERIFY_URL}/verify/status/${encodeURIComponent(address)}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data: VerificationResponse = await response.json();
      return data;
    },
    enabled: !!address,
  });
}

export function Verifications() {
  const { address } = useAccount();
  const { data } = useVerifications({ address });

  if (!address) return <div>Connect your wallet to see your verifications</div>;

  return (
    <div className="flex flex-col gap-4">
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <a
        href={`${BASE_VERIFY_URL}/verify/cb/start?address=${address}`}
        target="_blank"
        rel="noreferrer"
      >
        Verify with Coinbase
      </a>
      <a
        href={`${BASE_VERIFY_URL}/verify/x/start?address=${address}`}
        target="_blank"
        rel="noreferrer"
      >
        Verify with X
      </a>
    </div>
  );
}
