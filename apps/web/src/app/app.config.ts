import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
/// NgRx Store and Effects imports
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    /// NgRx Store and Effects setup
    provideStore({}), // Initializing with an empty object for the root
    provideEffects([]), // Initializing with an empty array for the root
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false, // Set to true in production
    }),
    ...(isDevMode() ? [provideStoreDevtools()] : []),
  ],
};
