import { Routes } from '@angular/router';
import { authResolver } from './resolvers/auth.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app.component').then((m) => m.AppComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/main/main.component').then((m) => m.MainComponent),
        resolve: { isAuthenticated: authResolver }
      },
    ],
  },
];
