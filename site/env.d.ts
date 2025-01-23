/// <reference types="vite/client" />
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: string;
  }
}

interface ImportMetaEnv {
  readonly VITE_CDP_API_KEY: string;
  readonly VITE_CDP_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
