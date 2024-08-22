import type { Address } from 'viem';

export const deployedContracts: Record<number, { click: Address }> = {
  [8543]: {
    click: '0x7d662A03CC7f493D447EB8b499cF4533f5B640E2',
  },
  [85432]: {
    click: '0x7d662A03CC7f493D447EB8b499cF4533f5B640E2',
  },
};

export const ENVIRONMENT = {
  API_KEY: 'API_KEY',
  ENVIRONMENT: 'ENVIRONMENT',
} as const;

type EnvironmentKey = (typeof ENVIRONMENT)[keyof typeof ENVIRONMENT];

export const ENVIRONMENT_VARIABLES: Record<EnvironmentKey, string | undefined> =
  {
    [ENVIRONMENT.API_KEY]: process.env.NEXT_PUBLIC_OCK_API_KEY,
    [ENVIRONMENT.ENVIRONMENT]: process.env.NEXT_PUBLIC_VERCEL_ENV,
  };
