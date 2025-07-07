export type AccountAssociationFields = {
  header: string;
  payload: string;
  signature: string;
};

export type MiniAppFields = {
  version: string;
  name: string;
  homeUrl: string;
  iconUrl: string;

  splashImageUrl?: string;
  splashBackgroundColor?: string;
  webhookUrl?: string;
  subtitle?: string;
  description?: string;
  screenshotUrls?: readonly string[];
  primaryCategory?:
    | 'games'
    | 'social'
    | 'finance'
    | 'utility'
    | 'productivity'
    | 'health-fitness'
    | 'news-media'
    | 'music'
    | 'shopping'
    | 'education'
    | 'developer-tools'
    | 'entertainment'
    | 'art-creativity';
  tags?: readonly string[];
  heroImageUrl?: string;
  tagline?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  noindex?: boolean;
  requiredChains?: readonly string[];
  requiredCapabilities?: readonly string[];
  canonicalDomain?: string;

  // Deprecated fields
  /** @deprecated */
  imageUrl?: string;
  /** @deprecated */
  buttonTitle?: string;
};

export type MiniAppManifest =
  | {
      accountAssociation?: AccountAssociationFields;
      miniapp: MiniAppFields;
    }
  | {
      accountAssociation?: AccountAssociationFields;
      frame: MiniAppFields;
    };
