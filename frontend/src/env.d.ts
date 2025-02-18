/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_API: string
  readonly PUBLIC_APPWRITE_ENDPOINT: string
  readonly PUBLIC_APPWRITE_PROJECT_ID: string
  readonly PUBLIC_APPWRITE_DATABASE_ID: string
  readonly PUBLIC_APPWRITE_COLLECTION_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
