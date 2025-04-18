import { domainManifestSchema, FrameEmbedNext } from '@farcaster/frame-core';
import { z } from 'zod';

export type AccountAssociation = FarcasterManifest['accountAssociation'];

export type Frame = FarcasterManifest['frame'];

export type FarcasterManifest = z.infer<typeof domainManifestSchema>;

export type FrameMetadata = FrameEmbedNext;
