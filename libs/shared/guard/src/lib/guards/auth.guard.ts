import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { take, firstValueFrom } from 'rxjs';
import { AuthFacade } from '@insurFlow/auth-data';
import { Snackbar } from '@insurFlow/services';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const facade = inject(AuthFacade);
  const snackbar = inject(Snackbar);

  try {
    const userInfo = await firstValueFrom(facade.loggedInUser$.pipe(take(1)));
    if (!userInfo || !userInfo.data?.userEmail) {
      alert('log in first');
      snackbar.displaySnackBar(
        'You need to be logged in to access this page',
        '',
        'red-snackbar',
      );
      console.warn('User is not authenticated, redirecting to login');
      return router.navigate(['/auth/login']);
    }

    return true;
  } catch (error) {
    console.error('Error in authGuard:', error);
    return router.navigate(['/auth/login']);
  }
};
