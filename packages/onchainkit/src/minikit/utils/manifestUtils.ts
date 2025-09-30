import type {
  MiniAppManifest,
  MiniAppFields,
  LegacyMiniAppManifest,
} from './types';

export function withValidManifest<
  T extends MiniAppManifest | LegacyMiniAppManifest,
>(manifest: T): T {
  const { accountAssociation, miniapp, frame, ...rest } = manifest;

  const miniappObject =
    ('miniapp' in manifest && miniapp) || ('frame' in manifest && frame);

  // Validate that miniapp object exists
  if (!miniappObject) {
    throw new Error('Invalid manifest: miniapp field is required');
  }

  // Validate required fields
  const requiredFields: Array<keyof MiniAppFields> = [
    'version',
    'name',
    'homeUrl',
    'iconUrl',
  ];

  for (const field of requiredFields) {
    if (!miniappObject[field]) {
      throw new Error(`Invalid manifest: ${field} is required`);
    }
  }

  // Validate version constraint
  if (miniappObject.version !== '1') {
    throw new Error('Invalid manifest: version must be "1"');
  }

  // Clean optional fields that are missing/empty
  const cleanedMiniapp = Object.fromEntries(
    Object.entries(miniappObject).filter(([key, value]) => {
      if (requiredFields.includes(key as keyof MiniAppFields)) {
        return true;
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return value !== undefined && value !== null && value !== '';
    }),
  ) as MiniAppFields;

  const hasValidAccountAssociation =
    accountAssociation &&
    accountAssociation.header &&
    accountAssociation.payload &&
    accountAssociation.signature;

  if (accountAssociation && !hasValidAccountAssociation) {
    console.warn(
      'Invalid manifest accountAssociation. Omitting from manifest.',
    );
  }

  return {
    ...(hasValidAccountAssociation && {
      accountAssociation: manifest.accountAssociation,
    }),
    miniapp: cleanedMiniapp,
    ...rest,
  } as T;
}
