import sdk from '@farcaster/frame-sdk';
import type { SignIn as SignInCore } from '@farcaster/frame-sdk';
import { useCallback } from 'react';
import { useMiniKit } from './useMiniKit';

type ParsedSignInMessage = {
  address: string;
  chainID: string;
  domain: string;
  issuedAt: string;
  nonce: string;
  resources: string[];
  uri: string;
  version: string;
};

/**
 * Parse the sign in message
 * @param message - The sign in message to parse
 * @returns {ParsedSignInMessage} - The parsed sign in message
 */
export function parseSignInMessage(message: string): ParsedSignInMessage {
  const [domainLine, address, ...rest] = message.split('\n');
  const [domain] = domainLine.split(
    ' wants you to sign in with your Ethereum account:',
  );

  const parsedData: ParsedSignInMessage = {
    domain,
    address,
    chainID: '',
    issuedAt: '',
    nonce: '',
    resources: [],
    uri: '',
    version: '',
  };

  return rest.reduce((acc, line) => {
    if (line.includes(': ')) {
      const [key, value] = line.split(': ');
      const camelKey = key.replace(/^([^\s]+)(?:\s+)?/, (_, firstWord) =>
        firstWord.toLowerCase(),
      );
      acc[camelKey as keyof Omit<ParsedSignInMessage, 'resources'>] = value;
      return acc;
    }

    if (line.startsWith('- ')) {
      acc.resources.push(line.slice(2));
      return acc;
    }

    return acc;
  }, parsedData);
}

type ValidateSignInMessageProps = {
  message: string;
  domain?: string;
  fid?: number;
  nonce?: string;
};

/**
 * Validate the sign in message
 * @param message - The sign in message to validate
 * @param domain [optional] - The domain of the frame to validate against, if not provided, the domain will not be validated
 * @param fid [optional] - The fid of the frame to validate against, if not provided, the fid will not be validated
 * @param nonce [optional] - The nonce to validate against, if not provided, the nonce will not be validated
 * @returns void
 */
function validateSignInMessage({
  message,
  domain,
  fid,
  nonce,
}: ValidateSignInMessageProps) {
  const parsed = parseSignInMessage(message);
  if (domain) {
    const domainUrlObj = new URL(domain);

    // domain in message should match frame's domain
    if (domainUrlObj.hostname !== parsed.domain) {
      throw new Error('Domain mismatch');
    }
  }

  // validate nonce
  if (nonce && parsed.nonce !== nonce) {
    throw new Error('Nonce mismatch');
  }

  // validate fid
  if (fid) {
    const fidRegex = new RegExp(`^farcaster://fid/${fid}$`);
    const fidMatch = parsed.resources.find((resource) =>
      fidRegex.test(resource),
    );
    if (!fidMatch) {
      throw new Error('Fid mismatch');
    }
  }
}

type UseAuthenticateProps = Omit<SignInCore.SignInOptions, 'nonce'> & {
  nonce?: string;
};

/**
 * Authenticates the user's account.
 * @param domain [optional] - The domain of the frame to authenticate against, if not provided, the domain will not be validated
 * @param skipValidation [optional] - Whether to skip validation of the nonce and fid, by default it will validate the nonce and fid
 * @returns `signIn` - A function that wraps the frames SDK signIn action and returns the result of the signIn action
 */
export const useAuthenticate = (domain?: string, skipValidation = false) => {
  const { context } = useMiniKit();

  const signIn = useCallback(
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
        if (!skipValidation) {
          validateSignInMessage({
            message: result.message,
            domain,
            fid: context?.user?.fid,
            nonce: signInOptions.nonce,
          });
        }

        return result;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [context?.user?.fid, domain, skipValidation],
  );

  return { signIn };
};
