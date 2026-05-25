import { Route } from '@angular/router';
import { authGuard } from '@insurFlow/guard';

export const appRoutes: Route[] = [
  {
    path: 'clients',
    loadChildren: () =>
      import('@insurFlow/clients').then((m) => m.clientsRoutes),
  },
  {
    path: '',
    loadChildren: () =>
      import('@insurFlow/landing-page').then((m) => m.landingPageRoutes),
  },
  {
    path: 'auth',
    loadChildren: () => import('@insurFlow/auth').then((m) => m.authRoutes),
  },
  {
    path: 'dashboard',
    // canActivate: [authGuard],
    loadChildren: () => import('@insurFlow/layout').then((m) => m.layoutRoutes),
  },
];
