import type { MiniAppManifest, MiniAppFields } from './types';

export function withValidManifest(manifest: MiniAppManifest): MiniAppManifest {
  // Validate that miniapp object exists
  if (!manifest.miniapp) {
    throw new Error('Invalid manifest: miniapp field is required');
  }

  const { miniapp } = manifest;

  // Validate required fields
  const requiredFields: Array<keyof MiniAppFields> = [
    'version',
    'name',
    'homeUrl',
    'iconUrl',
  ];

  for (const field of requiredFields) {
    if (!miniapp[field]) {
      throw new Error(`Invalid manifest: ${field} is required`);
    }
  }

  // Validate version constraint
  if (miniapp.version !== '1') {
    throw new Error('Invalid manifest: version must be "1"');
  }

  // Clean optional fields that are missing/empty
  const cleanedMiniapp = Object.fromEntries(
    Object.entries(miniapp).filter(([key, value]) => {
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
    manifest.accountAssociation &&
    manifest.accountAssociation.header &&
    manifest.accountAssociation.payload &&
    manifest.accountAssociation.signature;

  if (manifest.accountAssociation && !hasValidAccountAssociation) {
    console.warn(
      'Invalid manifest accountAssociation. Omitting from manifest.',
    );
  }

  return {
    ...(hasValidAccountAssociation && {
      accountAssociation: manifest.accountAssociation,
    }),
    miniapp: cleanedMiniapp,
  };
}
