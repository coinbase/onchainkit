/// <reference types="vite/client" />
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: string;
  }
}

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_CDP_API_KEY: string;
  readonly NEXT_PUBLIC_CDP_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
