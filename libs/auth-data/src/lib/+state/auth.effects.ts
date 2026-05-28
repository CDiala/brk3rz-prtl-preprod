import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import {
  switchMap,
  catchError,
  of,
  exhaustMap,
  from,
  map,
  tap,
  EMPTY,
} from 'rxjs';
import * as AuthActions from './auth.actions';
// import { Auth } from '@insurFlow/auth-data';
import { Snackbar } from '@insurFlow/services';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';
import { ResetLinkInfo, sendResetLinkResponse } from '@insurFlow/core';
import { userSuccessResponse } from './auth.models';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(Auth);
  private snackbarService = inject(Snackbar);
  private router = inject(Router);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initAuth),
      switchMap(() => of(AuthActions.loadAuthSuccess({ auth: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(AuthActions.loadAuthFailure({ error }));
      }),
    ),
  );

  getPublicKey$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getPublicKey),
      exhaustMap(() =>
        from(this.authService.getPublicKey()).pipe(
          map((res) => {
            if (res && res.publicKey) {
              return AuthActions.getPublicKeySuccess({ koi: res.publicKey });
            }
            return AuthActions.getPublicKeyFailure({
              error: `Unable to get public key`,
            });
          }),
          catchError((error) => {
            return of(AuthActions.getPublicKeyFailure({ error }));
          }),
        ),
      ),
    ),
  );

  loginUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginUser),

      // 1. Use exhaustMap to prevent multiple concurrent login attempts
      exhaustMap(({ credentials }) =>
        // 2. Convert Promise to Observable so switchMap can "wait" for it
        from(this.authService.login(credentials)).pipe(
          // 3. Map the successful response to a Success or Failure action
          map((response) => {
            if (response?.data?.userId && response) {
              this.snackbarService.displaySnackBar(
                'Login successful',
                '',
                'green-snackbar',
              );
              return AuthActions.loginUserSuccess({ visitor: response });
            }

            this.snackbarService.displaySnackBar(
              'Login failed',
              '',
              'red-snackbar',
            );
            return AuthActions.loginUserFailure({ error: 'Login failed' });
          }),
          // 4. Handle actual code/network errors here (Inner catchError)
          // This keeps the outer effect alive even if this call fails
          // catchError((error) => {
          //   console.error('Login error:', error);
          //   return of(
          //     AuthActions.loginUserFailure({
          //       error:
          //         typeof error.error === 'object'
          //           ? error || 'unable to login'
          //           : error.error || 'unable to login',
          //     }),
          //   );
          // }),
          catchError((error) => {
            console.error('Login error:', error);

            // Extract the direct backend data object layer ({ code, message, data })
            const apiPayload = error.error || error;

            const standardError =
              apiPayload &&
              typeof apiPayload === 'object' &&
              'message' in apiPayload
                ? apiPayload
                : {
                    code: error.status || 'UNKNOWN',
                    message: error.message || 'unable to login',
                    data: null,
                  };

            return of(AuthActions.loginUserFailure({ error: standardError }));
          }),
        ),
      ),
    ),
  );

  loginRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginUserSuccess),
        tap(() => this.router.navigate(['/dashboard'])), // Side effect only
      ),
    { dispatch: false },
  );

  getRoleEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginUserSuccess),
      exhaustMap(({ visitor }) =>
        from(this.authService.getRoleUser({})).pipe(
          map((res) => {
            if (res) {
              this.snackbarService.displaySnackBar(
                `Role retrieved successfully!`,
                '',
                'green-snackbar',
              );
              return AuthActions.getUserMeSuccess({ userMe: res });
            }

            this.snackbarService.displaySnackBar(
              `Role failed, please contact the site admin`,
              '',
              'red-snackbar',
            );

            return AuthActions.registerFailure({
              error: `Role failed, please contact the site admin`,
            });
          }),
          catchError((error) => {
            return of(AuthActions.registerFailure({ error }));
          }),
        ),
      ),
    ),
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ data }) =>
        from(this.authService.register(data)).pipe(
          map((res) => {
            if (res) {
              this.snackbarService.displaySnackBar(
                `Registration completed successfully!`,
                '',
                'green-snackbar',
              );
              return AuthActions.registerSuccess({ response: res.data });
            }

            this.snackbarService.displaySnackBar(
              `Registration failed, please contact the site admin`,
              '',
              'red-snackbar',
            );

            return AuthActions.registerFailure({
              error: `Registration failed, please contact the site admin`,
            });
          }),
          catchError((error) => {
            return of(AuthActions.registerFailure({ error }));
          }),
        ),
      ),
    ),
  );

  updatePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updatePassword),
      exhaustMap(({ data }) =>
        from(this.authService.updatePassword(data)).pipe(
          map((res) => {
            if (res.code === '00') {
              this.snackbarService.displaySnackBar(
                `Password update completed successfully!`,
                '',
                'green-snackbar',
              );
              return AuthActions.updatePasswordSuccess({ response: res.data });
            }

            this.snackbarService.displaySnackBar(
              `Password update failed, please contact the site admin`,
              '',
              'red-snackbar',
            );

            return AuthActions.updatePasswordFailure({
              error: `Password update failed, please contact the site admin`,
            });
          }),
          catchError((error) => {
            return of(AuthActions.updatePasswordFailure({ error }));
          }),
        ),
      ),
    ),
  );

  sendResetEmail = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.sendResetLink),
      exhaustMap((payload) =>
        from(this.authService.sendResetLink(payload)).pipe(
          map((res: sendResetLinkResponse<boolean | null>) => {
            if (res && res.code === '00') {
              this.snackbarService.displaySnackBar(
                'Email sent successfully',
                '',
                'green-snackbar',
              );
              return AuthActions.sendResetLinkSuccess({
                info: {
                  email: payload.email,
                  isEmailSent: res.data,
                },
              });
            }
            this.snackbarService.displaySnackBar(
              'Failed to send email, please contact the site admin',
              '',
              'red-snackbar',
            );

            return AuthActions.sendResetLinkFailure({
              error: 'Unable to send email.',
            });
          }),
          catchError((error) => {
            console.error('Unable to send email:', error);
            return of(
              AuthActions.sendResetLinkFailure({
                error: 'Unable to send email.',
              }),
            );
          }),
        ),
      ),
    ),
  );

  getUserName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getNameUser),
      exhaustMap(({ userId }) =>
        from(this.authService.getUserNameEP(userId as string)).pipe(
          // Use map instead of tap when you need to dispatch an action
          map((res) => {
            if (res) {
              console.log('Username retrieved successfully:', res);

              this.snackbarService.displaySnackBar(
                'User name retrieved successfully',
                '',
                'green-snackbar',
              );

              return AuthActions.getNameUserSuccess({ res: res });
            }

            // Fallback if res is falsy but request didn't fail
            return AuthActions.getNameUserFailure({
              error: 'Empty response from server',
            });
          }),
          catchError((error) => {
            console.error('Get Username API error:', error);

            this.snackbarService.displaySnackBar(
              error.message || 'Network error',
              '',
              'red-snackbar',
            );

            return of(
              AuthActions.getNameUserFailure({
                error: error.message || 'Unable to retrieve user name',
              }),
            );
          }),
        ),
      ),
    ),
  ); // Note: { dispatch: true } is the default, so you don't need to specify it explicitly

  uploadLicence$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.uploadLicence),
      exhaustMap(({ formData }) =>
        from(this.authService.uploadLicenceEP(formData)).pipe(
          map((res) => {
            if (res) {
              console.log('Licence uploaded successfully:', res);

              this.snackbarService.displaySnackBar(
                'Licence uploaded successfully',
                '',
                'green-snackbar',
              );

              return AuthActions.uploadLicenceSuccess({ response: res });
            }

            // Fallback if res is falsy but request didn't fail
            return AuthActions.uploadLicenceFailure({
              error: 'Empty response from server',
            });
          }),
          catchError((error) => {
            console.error('Upload Licence API error:', error);

            this.snackbarService.displaySnackBar(
              error.message || 'Network error',
              '',
              'red-snackbar',
            );

            return of(
              AuthActions.uploadLicenceFailure({
                error: error.message || 'Unable to upload licence',
              }),
            );
          }),
        ),
      ),
    ),
  ); // Note: { dispatch: true } is the default, so you don't need to specify it explicitly
}
