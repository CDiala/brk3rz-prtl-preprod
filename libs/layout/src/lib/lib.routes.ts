import { Route } from '@angular/router';
import { Layout } from './layout/layout';

export const layoutRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((c) => c.Layout),
    children: [
      {
        path: 'clients',
        loadChildren: () =>
          import('@insurFlow/clients').then((m) => m.clientsRoutes),
      },
      { path: 'ebusiness', component: Layout },
      { path: 'quotes', component: Layout },
      { path: 'claims', component: Layout },
      { path: 'support', component: Layout },
      { path: 'cnTrack', component: Layout },
      { path: 'commissions', component: Layout },
      { path: 'reports', component: Layout },
      { path: 'settings', component: Layout },
    ],
  },
];
