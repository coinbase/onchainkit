import { SyndicateFrameApiErrorResponse, SyndicateFrameApiResponse } from '../core/types';

export function isFailedFrameApiResponse<T>(
  response: SyndicateFrameApiResponse<T>,
): response is SyndicateFrameApiErrorResponse {
  return response.success === false;
}
