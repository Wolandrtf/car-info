/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MASK_PERSONAL_DATA?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
