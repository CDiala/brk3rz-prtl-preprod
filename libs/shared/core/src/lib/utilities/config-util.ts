import { InjectionToken } from '@angular/core';

// Define a shape for your config
export interface AppConfig {
  production: boolean;
  isDev: boolean;
  beBaseUrl: string;
  docDirectory: string;
  encryptKey: string;
  encryptIV: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
