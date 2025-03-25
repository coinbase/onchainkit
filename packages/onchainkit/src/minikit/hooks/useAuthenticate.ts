import sdk from '@farcaster/frame-sdk';
import type { SignIn as SignInCore } from '@farcaster/frame-sdk';
import { useCallback } from 'react';

/*
 * Validate the domain of the SWIF message matches the frame's domain set in the .env file
 * @param message - The SWIF message to validate
 * @param domain - The domain of the frame to authenticate against
 * @throws {Error} - Throws an error if the domain or uri is invalid
 * @returns boolean - true if the domain and uri are valid, false otherwise
 */
const validateDomainAndUri = (message: string, domain: string) => {
  const firstLine = message.split('\n')[0];
  const domainFromMessage = firstLine.split(
    ' wants you to sign in with your Ethereum account:',
  )[0];

  const domainUrlObj = new URL(domain);

  // domain in message should match frame's domain
  if (domainUrlObj.hostname !== domainFromMessage) {
    throw new Error('Domain mismatch');
  }
};

type UseAuthenticateProps = Omit<SignInCore.SignInOptions, 'nonce'> & {
  nonce?: string;
};

/**
 * Authenticates the user's account.
 * @param domain [optional] - The domain of the frame to authenticate against, if not provided, the domain will not be validated
 * @returns The frames SDK signInResult consistent of a message, a signature, and a nonce or false if the domain or uri is invalid
 */
export const useAuthenticate = (domain?: string) => {
  return useCallback(
    async (signInOptions: UseAuthenticateProps = {}) => {
      try {
        if (!signInOptions?.nonce) {
          signInOptions.nonce = [...Array(8)]
            .map(() => Math.floor(Math.random() * 36).toString(36))
            .join('');
        }

        const result = await sdk.actions.signIn(
          signInOptions as SignInCore.SignInOptions,
        );
        if (domain) {
          validateDomainAndUri(result.message, domain);
        }
        return result;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [domain],
  );
};
