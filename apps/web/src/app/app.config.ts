import { authInterceptor } from '@insurFlow/auth-data';
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
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APP_CONFIG } from '@insurFlow/core';
import { loadingInterceptor } from '@insurFlow/loading';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideStore({}), // Initializing with an empty object for the root
    provideEffects([]), // Initializing with an empty array for the root
    ...(isDevMode()
      ? [
          provideStoreDevtools({
            maxAge: 25,
            logOnly: false, // Set to true in production
          }),
        ]
      : []),
    provideHttpClient(withFetch()),
    provideHttpClient(withInterceptors([loadingInterceptor, authInterceptor])),
    { provide: APP_CONFIG, useValue: environment },
    MatSnackBar,
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        // If width is provided (from ngSrcset), use the resized file
        if (config.width) {
          return `${config.src.replace('.webp', '')}-${config.width}.webp`;
        }
        // Fallback for the base ngSrc
        return `${config.src}`;
      },
    },
  ],
};
