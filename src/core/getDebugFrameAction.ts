import { FrameRequest, FrameValidationData } from './types';

type DebugFrameRequestOptions = {
  following?: boolean; // Indicates if the viewer clicking the frame follows the cast author
  interactor?: {
    fid?: number; // Viewer Farcaster ID
    custody_address?: string; // Viewer custody address
    verified_accounts?: string[]; // Viewer account addresses
  };
  liked?: boolean; // Indicates if the viewer clicking the frame liked the cast
  recasted?: boolean; // Indicates if the viewer clicking the frame recasted the cast
};

type DebugFrameRequest = FrameRequest & { onchainkitDebug: Required<FrameValidationData> };

/**
 * Modify a standard frame request to include simulated values (e.g., indicate the viewer
 * follows the cast author) for development/debugging purposes.
 * @param request A standard frame request.
 * @param options An object containing values we will pretend are real for the purposes of debugging.
 * @returns
 */
function getDebugFrameAction(
  request: FrameRequest,
  options: DebugFrameRequestOptions,
): DebugFrameRequest {
  return {
    ...request,
    onchainkitDebug: {
      button: request.untrustedData.buttonIndex,
      input: request.untrustedData.inputText,
      following: !!options.following,
      interactor: {
        fid: options.interactor?.fid || 0,
        custody_address: options.interactor?.custody_address || '0xnotarealaddress',
        verified_accounts: options.interactor?.verified_accounts || [],
      },
      liked: !!options.liked,
      recasted: !!options.recasted,
      valid: true,
      raw: {
        valid: true,
        // TODO: unjank
        action: {} as any,
      },
    },
  };
}

export { getDebugFrameAction, type DebugFrameRequest };
