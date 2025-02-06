import sdk from '@farcaster/frame-sdk';
import type { SignIn as SignInCore } from '@farcaster/frame-sdk';
import { useCallback } from 'react';

/*
 * Validate the domain of the SWIF message matches the frame's domain
 * @param message - The SWIF message to validate
 * @throws {Error} - Throws an error if the domain or uri is invalid
 */
const validateDomainAndUri = (message: string) => {
  const firstLine = message.split('\n')[0];
  const domain = firstLine.split(
    ' wants you to sign in with your Ethereum account:',
  )[0];

  const frameUrl = process.env.NEXT_PUBLIC_URL;
  if (!frameUrl) {
    throw new Error('NEXT_PUBLIC_URL not configured');
  }

  const frameUrlObj = new URL(frameUrl);

  // domain in message should match frame's domain
  if (frameUrlObj.hostname !== domain) {
    throw new Error('Domain mismatch');
  }
};

type UseAuthenticateProps = Omit<SignInCore.SignInOptions, 'nonce'> & {
  nonce?: string;
};

export const useAuthenticate = () => {
  return useCallback(async (signInOptions: UseAuthenticateProps = {}) => {
    try {
      if (!signInOptions?.nonce) {
        signInOptions.nonce = [...Array(8)]
          .map(() => Math.floor(Math.random() * 36).toString(36))
          .join('');
      }

      const result = await sdk.actions.signIn(
        signInOptions as SignInCore.SignInOptions,
      );
      validateDomainAndUri(result.message);
      return result;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, []);
};
