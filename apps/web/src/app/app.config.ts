/* eslint-disable @nx/enforce-module-boundaries */
import { authInterceptor } from '@insurFlow/auth-data';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  isDevMode,
  PLATFORM_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideState, provideStore, Store } from '@ngrx/store';
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
import { APP_BASE_HREF } from '@angular/common';
import { StatePersistenceService } from '../../../../libs/auth-data/src/lib/services/state-persistence.service';
import { initializeApp } from '../../../../libs/auth-data/src/lib/+state/initialize-app';
import { AuthEffects } from 'libs/auth-data/src/lib/+state/auth.effects';
import * as fromHost from 'libs/auth-data/src/lib/+state/auth.reducer';
import { AuthFacade } from 'libs/auth-data/src/lib/+state/auth.facade';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_BASE_HREF, useValue: environment.baseHref },
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideStore({}), // Initializing with an empty object for the root
    provideState(fromHost.AUTH_FEATURE_KEY, fromHost.authReducer),
    AuthFacade,
    provideEffects([AuthEffects]), // Initializing with an empty array for the root
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
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeApp,
    //   deps: [Store, StatePersistenceService, PLATFORM_ID], // Add PLATFORM_ID here
    //   multi: true,
    // },
    provideAppInitializer(() => {
      const store = inject(Store);
      const persistenceService = inject(StatePersistenceService);
      const platformId = inject(PLATFORM_ID);

      // ✅ Executes the flattened function directly
      initializeApp(store, persistenceService, platformId);
    }),
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
