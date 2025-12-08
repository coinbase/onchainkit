const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  accountAssociation: {
    header:
      "eyJmaWQiOjYxNjIsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg4NTIxQkZFNjgwOTVDYURBYTFEZWZGZjJjN0NjNTMyNGJlMzcyRThmIn0",
    payload:
      "eyJkb21haW4iOiJvY2stbWluaWtpdC1leGFtcGxlLWdpdC1hbHBoYS1jb2luYmFzZS12ZXJjZWwudmVyY2VsLmFwcCJ9",
    signature:
      "MHhkZTA0ODk4YmE1MGMwMWM3ZWRlY2ViZWJkY2E0ZjA0ZTVlN2NkMTFiNWQxM2UxMjg4OWJiNzgwYTcyNWRhMGFlNTgyNGNlYmFiM2RjODdhNmIwYjNlNjExNTM1MjE1ODQ0MGI1NzU1ZTFhNGE3NzY5NDQwZWMyN2Y2NjhiYjY4NzFj",
  },
  baseBuilder: {
    ownerAddress: "",
  },
  miniapp: {
    version: "1",
    name: "minikit-example",
    subtitle: "",
    description: "",
    screenshotUrls: [],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["example"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
