/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AuthEffects } from '../../../auth-data/src/lib/+state/auth.effects';
import { AuthFacade } from '../../../auth-data/src/lib/+state/auth.facade';
import * as fromAuth from '../../../auth-data/src/lib/+state/auth.reducer';

export const authRoutes: Route[] = [
  {
    path: '',
    providers: [
      AuthFacade,
      provideState(fromAuth.AUTH_FEATURE_KEY, fromAuth.authReducer),
      provideEffects(AuthEffects),
    ],
    loadComponent: () => import('./components/auth/auth').then((m) => m.Auth),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/signup/signup').then((m) => m.Signup),
      },
      {
        path: 'password-reset',
        loadComponent: () =>
          import('./components/signup/signup').then((m) => m.Signup),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./components/identify-user/identify-user').then(
            (m) => m.IdentifyUser,
          ),
      },
       {
        path: 'licence-renewal',
        loadComponent: () =>
          import('./components/licence-renewal/licence-renewal').then(
            (l) => l.LicenceRenewal,
          ),
      },
      // {
      //   path: 'reset-link-success',
      //   loadComponent: () =>
      //     import('./components/password-reset-sent/password-reset-sent').then(
      //       (m) => m.PasswordResetSent,
      //     ),
      // },
    ],
  },
  {
    path: 'reset-link-success',
    loadComponent: () =>
      import('./components/password-reset-sent/password-reset-sent').then(
        (m) => m.PasswordResetSent,
      ),
  },
];
