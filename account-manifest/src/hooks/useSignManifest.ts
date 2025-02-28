// hooks/useAccountManifest.ts
import { useEffect, useRef } from 'react';
import { useSignMessage } from 'wagmi';
import { toBase64Url } from '../utils';

export type AccountAssociation = {
  header: string;
  payload: string;
  signature: string;
  domain: string;
};

type SignManifestProps = {
  domain: string;
  fid: number | null;
  address: string | undefined;
  onSigned: (accountAssociation: AccountAssociation) => void;
};

export function useSignManifest({
  domain,
  fid,
  address,
  onSigned,
}: SignManifestProps) {
  const encodedHeader = useRef<string>('');
  const encodedPayload = useRef<string>('');
  const {
    data: signMessageData,
    isPending,
    error,
    signMessage,
  } = useSignMessage();

  useEffect(() => {
    async function signManifest() {
      if (signMessageData) {
        const encodedSignature = toBase64Url(signMessageData);
        const accountAssociation = {
          header: encodedHeader.current,
          payload: encodedPayload.current,
          signature: encodedSignature,
          domain: domain,
        };

        console.log('Account association generated:', accountAssociation);
        onSigned(accountAssociation);
      }
    }

    signManifest();
  }, [signMessageData, domain, onSigned]);

  const generateAccountAssociation = async () => {
    if (!domain || !fid || !address) {
      console.error('Domain, FID and wallet connection are required');
      return;
    }

    const header = {
      fid,
      type: 'custody',
      key: address,
    };

    const payload = {
      domain: domain.replace(/^(http|https):\/\//, ''),
    };

    encodedHeader.current = toBase64Url(JSON.stringify(header));
    encodedPayload.current = toBase64Url(JSON.stringify(payload));
    const messageToSign = `${encodedHeader.current}.${encodedPayload.current}`;

    signMessage({ message: messageToSign });
  };

  return {
    isPending,
    error,
    generateAccountAssociation,
  };
}
