import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authResolver: ResolveFn<boolean> = (route, state) => {
  const authService = inject(AuthService);
  return new Observable<boolean>((observer) => {
    authService.getAuthToken().subscribe({
      next: (authResponse) => {
        if (authResponse) {
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      },
      error: (error) => {
        console.error('Authentication failed', error);
        observer.next(false);
        observer.complete();
      }
    });
  });
};
