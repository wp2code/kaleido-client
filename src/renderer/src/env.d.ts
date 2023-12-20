/** @format */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RD_VITE_PORT: string
  readonly RD_VITE_API_HOST: string
  readonly RD_VITE_API_PREFIX: string
  readonly RD_VITE_ACCESS_APP_ID: string
  readonly RD_VITE_ACCESS_APP_ID_VALUE: string
  readonly RD_VITE_ACCESS_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
