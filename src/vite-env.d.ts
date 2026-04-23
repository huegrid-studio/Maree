/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WORKBENCH_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
