/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYPAL_DONATE_HOSTED_BUTTON_ID?: string;
  readonly VITE_PAYPAL_DONATE_ENV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
