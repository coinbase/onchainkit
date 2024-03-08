import { atom } from 'jotai';
import { fetchFrame } from './fetchFrame';
import { MockFrameRequestOptions } from '@coinbase/onchainkit/frame';

// We store an array here so that we can step through history, e.g. seeing the
// chain of responses through a number of frame actions.
export const frameResultsAtom = atom<Awaited<ReturnType<typeof fetchFrame>>[]>([]);

export const mockFrameOptionsAtom = atom<MockFrameRequestOptions>({});
