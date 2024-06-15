/// <reference types="vite/client" />
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: string;
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const NEXT_PUBLIC_CDP_API_KEY: string;
