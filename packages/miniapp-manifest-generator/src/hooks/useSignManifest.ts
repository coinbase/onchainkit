import { useEffect, useState } from 'react';
import { useSignMessage } from 'wagmi';
import { toBase64Url } from '../utilities/base64';
import { AccountAssociation } from '../types';

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
  const [encodedHeader, setEncodedHeader] = useState<string>('');
  const [encodedPayload, setEncodedPayload] = useState<string>('');

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
          header: encodedHeader,
          payload: encodedPayload,
          signature: encodedSignature,
          domain: domain.replace(/\/$/, ''), // remove trailing slash
        };

        console.log('Mini-App manifest generated:', accountAssociation);
        onSigned(accountAssociation);
      }
    }
    if (encodedHeader && encodedPayload) {
      signManifest();
    }
  }, [signMessageData, domain, onSigned, encodedHeader, encodedPayload]);

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

    const domainString = new URL(domain).hostname;
    const payload = {
      domain: domainString,
    };

    const encodedHeader = toBase64Url(JSON.stringify(header));
    const encodedPayload = toBase64Url(JSON.stringify(payload));

    setEncodedHeader(encodedHeader);
    setEncodedPayload(encodedPayload);

    const messageToSign = `${encodedHeader}.${encodedPayload}`;

    signMessage({ message: messageToSign });
  };

  return {
    isPending,
    error,
    generateAccountAssociation,
  };
}
