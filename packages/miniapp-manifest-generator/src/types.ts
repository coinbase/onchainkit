import {
  frameEmbedNextSchema,
  domainManifestSchema,
} from '@farcaster/frame-core';
import { z } from 'zod';

// extend the frameEmbedNextSchema to add in the same version options as the domainManifestSchema
export const frameEmbedSchema = z.object({
  ...frameEmbedNextSchema.shape,
  version: z.union([
    z.literal('0.0.0'),
    z.literal('0.0.1'),
    z.literal('1'),
    z.literal('next'),
  ]),
});

export const accountAssociationSchema =
  domainManifestSchema.shape.accountAssociation;

// unwrap the frame schema to make it required
export const frameSchema = domainManifestSchema.shape.frame.unwrap();

// export schema types
export type FarcasterManifest = z.infer<typeof domainManifestSchema>;
export type FrameEmbed = z.infer<typeof frameEmbedSchema>;
export type AccountAssociation = z.infer<typeof accountAssociationSchema>;
export type Frame = z.infer<typeof frameSchema>;
