import { FrameValidationData } from '../../../frame/types';
import { NeynarFrameValidationInternalModel } from './types';

export function convertToNeynarResponseModel(data: any): FrameValidationData | undefined {
  if (!data) {
    return;
  }

  /**
   * Note: This is not a type-safe conversion, however, balancing that risk with an additional import
   * to include a library like AJV which can accomplish that.  Alternatively, we could write conversions
   * for each type, but that seemed overkill.
   */
  const neynarResponse = data as NeynarFrameValidationInternalModel;

  // Shorten paths
  const action = neynarResponse.action;
  const cast = action?.cast;
  const interactor = action?.interactor;

  return {
    button: action?.tapped_button?.index,
    following: action?.interactor?.viewer_context?.following,
    input: action?.input?.text,
    interactor: {
      fid: interactor?.fid,
      custody_address: interactor?.custody_address,
      verified_accounts: interactor?.verifications,
      verified_addresses: {
        eth_addresses: interactor?.verified_addresses?.eth_addresses,
        sol_addresses: interactor?.verified_addresses?.sol_addresses,
      },
    },
    liked: cast?.viewer_context?.liked,
    raw: neynarResponse,
    recasted: cast?.viewer_context?.recasted,
    state: {
      serialized: action?.state?.serialized || '',
    },
    valid: neynarResponse.valid,
  };
}
