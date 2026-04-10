import { Route } from '@angular/router';
import { Auth } from './auth/auth';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromAuth from './+state/auth.reducer';
import { AuthEffects } from './+state/auth.effects';
import { AuthFacade } from './+state/auth.facade';

export const authRoutes: Route[] = [
  {
    path: '',
    component: Auth,
    providers: [
      AuthFacade,
      provideState(fromAuth.AUTH_FEATURE_KEY, fromAuth.authReducer),
      provideEffects(AuthEffects),
    ],
  },
];
