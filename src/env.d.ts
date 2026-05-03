/// <reference types="astro/client" />

import type { Locale } from './i18n/locales';

declare namespace App {
  interface Locals {
    locale?: Locale;
    pathWithoutLocale?: string;
    runtime?: {
      env?: {
        DB?: unknown;
        SESSION?: unknown;
        GOOGLE_SHEETS_WEBHOOK_URL?: string;
        IP_SALT?: string;
      };
    };
  }
}
