import type { MockFrameRequestOptions } from '@coinbase/onchainkit/frame';
import { atom } from 'jotai';
import type { fetchFrame } from './fetchFrame';

// We store an array here so that we can step through history, e.g. seeing the
// chain of responses through a number of frame actions.
export const frameResultsAtom = atom<Awaited<ReturnType<typeof fetchFrame>>[]>([]);

export const mockFrameOptionsAtom = atom<MockFrameRequestOptions>({});
