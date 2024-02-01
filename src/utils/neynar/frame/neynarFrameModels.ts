import { FrameValidationData } from '../../../core/farcasterTypes';
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
    valid: neynarResponse.valid,
    button: action?.tapped_button?.index,
    liked: cast?.viewer_context?.liked,
    recasted: cast?.viewer_context?.recasted,
    following: action?.interactor?.viewer_context?.following,
    interactor: {
      fid: interactor?.fid,
      custody_address: interactor?.custody_address,
      verified_accounts: interactor?.verifications,
    },
    raw: neynarResponse,
  };
}
