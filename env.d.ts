/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RD_VITE_ACCESS_APP_ID: string
  readonly RD_VITE_ACCESS_TOKEN: string
  readonly RD_VITE_ACCESS_APP_ID_VALUE: string
  readonly RD_VITE_API_PREFIX: string
  readonly RD_VITE_API_HOST: string
  readonly RD_VITE_PORT: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
