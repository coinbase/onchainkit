import { FrameRequest, MockFrameRequest, MockFrameRequestOptions } from './types';

/**
 * Modify a standard frame request to include simulated values (e.g., indicate the viewer
 * follows the cast author) for development/debugging purposes.
 * @param request A standard frame request.
 * @param options An object containing values we will pretend are real for the purposes of debugging.
 * @returns
 */
function getMockFrameRequest(
  request: FrameRequest,
  options?: MockFrameRequestOptions,
): MockFrameRequest {
  return {
    ...request,
    mockFrameData: {
      button: request.untrustedData.buttonIndex,
      following: !!options?.following,
      input: request.untrustedData.inputText,
      interactor: {
        fid: options?.interactor?.fid || 0,
        custody_address: options?.interactor?.custody_address || '0xnotarealaddress',
        verified_accounts: options?.interactor?.verified_accounts || [],
        verified_addresses: {
          eth_addresses: null,
          sol_addresses: null,
        },
      },
      liked: !!options?.liked,
      recasted: !!options?.recasted,
      state: {
        serialized: request.untrustedData.state || '',
      },
      valid: true,
      raw: {
        valid: true,
        // TODO: unjank
        action: {} as any,
      },
    },
  };
}

export { getMockFrameRequest };
