import type { FrameRequest, MockFrameRequest, MockFrameRequestOptions } from '../types';
/**
 * Modify a standard frame request to include simulated values (e.g., indicate the viewer
 * follows the cast author) for development/debugging purposes.
 * @param request A standard frame request.
 * @param options An object containing values we will pretend are real for the purposes of debugging.
 * @returns
 */
declare function getMockFrameRequest(request: FrameRequest, options?: MockFrameRequestOptions): MockFrameRequest;
export { getMockFrameRequest };
//# sourceMappingURL=getMockFrameRequest.d.ts.map