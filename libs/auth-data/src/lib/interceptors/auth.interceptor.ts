import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpContextToken,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { take, switchMap, catchError, filter, map } from 'rxjs/operators';
import { CryptoService } from '../services/crypto.service';
import { getPublicKey, logout } from '../+state/auth.actions';
import { AuthFacade } from '../+state/auth.facade';
import { Auth } from '../services/auth';

export const SKIP_ENCRYPTION = new HttpContextToken<boolean>(() => false);

let isRefreshing = false;
const refreshSignalSubject = new BehaviorSubject<string | null>(null);

// ✅ TypeScript Custom Type Guard to resolve the lint error without an exclamation point
function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const store = inject(Store);
  const authFacade = inject(AuthFacade);
  const encryptionService = inject(CryptoService);
  const authService = inject(Auth);
  const isFileUpload = req.body instanceof FormData;
  const skipEncryption = req.context.get(SKIP_ENCRYPTION);
  const authReq = req.clone({
    withCredentials: true,
    // setHeaders: {
    //   // 💡 Captures your current runtime environment origin automatically
    //   'X-Client-Origin': window.location.origin,
    // },
  });

  console.log('req', authReq);

  if (
    skipEncryption ||
    isFileUpload ||
    !authReq.body ||
    authReq.method === 'GET'
  ) {
    console.log('get here');

    return proceedAndDecrypt(authReq, next, encryptionService).pipe(
      catchError((error: HttpErrorResponse) =>
        handleErrors(
          error,
          authReq,
          next,
          store,
          authService,
          encryptionService,
        ),
      ),
    );
  }

  return authFacade.koi$.pipe(
    take(1),
    switchMap((publicKey) => {
      if (publicKey) {
        return encryptAndProceed(authReq, publicKey, next, encryptionService);
      }

      store.dispatch(getPublicKey());
      return authFacade.koi$.pipe(
        filter(isNotNullOrUndefined), // ✅ Tells TypeScript the emitted value is strictly a string
        take(1),
        switchMap((newKey) =>
          encryptAndProceed(authReq, newKey, next, encryptionService),
        ), // 💡 REMOVED '!' operator
      );
    }),
    catchError((error: HttpErrorResponse) =>
      handleErrors(error, authReq, next, store, authService, encryptionService),
    ),
  );
};

function handleErrors(
  error: HttpErrorResponse,
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  store: Store,
  auth: Auth,
  crypto: CryptoService,
): Observable<HttpEvent<any>> {
  if (error.status === 401 && !req.url.includes('/auth/refresh')) {
    // TODO: replace with actual url
    return handle401Error(req, next, store, auth, crypto);
  }
  return throwError(() => error);
}

function encryptAndProceed(
  req: HttpRequest<any>,
  publicKey: string,
  next: HttpHandlerFn,
  crypto: CryptoService,
): Observable<HttpEvent<any>> {
  console.log('encrypt here');
  return crypto.encryptRequest(req.body, publicKey).pipe(
    switchMap((encryptedPayload) => {
      const encryptedReq = req.clone({
        body: encryptedPayload,
        // setHeaders: {
        //   // 💡 Captures your current runtime environment origin automatically
        //   'X-Client-Origin': window.location.origin,
        // },
      });
      console.log('encryptedReq', encryptedReq);
      return proceedAndDecrypt(encryptedReq, next, crypto);
    }),
  );
}

function proceedAndDecrypt(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  crypto: CryptoService,
): Observable<HttpEvent<any>> {
  console.log('decrypt here');
  return next(req).pipe(
    switchMap((event: any) => {
      if (event.body && event.body.data) {
        return crypto.decryptResponse(event.body.data).pipe(
          map((decryptedData) => {
            console.log(
              'fix',
              event.clone({
                body: { ...event.body, data: decryptedData },
              }),
            );

            return event.clone({
              body: { ...event.body, data: decryptedData },
              // setHeaders: {
              //   // 💡 Captures your current runtime environment origin automatically
              //   'X-Client-Origin': window.location.origin,
              // },
            });
          }),
        );
      }
      return [event];
    }),
  );
}

function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  store: Store,
  auth: Auth,
  crypto: CryptoService,
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshSignalSubject.next(null);

    return auth.refreshAccessToken().pipe(
      switchMap(() => {
        isRefreshing = false;
        refreshSignalSubject.next('REFRESH_SUCCESS');
        return proceedAndDecrypt(req, next, crypto);
      }),
      catchError((refreshErr) => {
        isRefreshing = false;
        store.dispatch(logout());
        return throwError(() => refreshErr);
      }),
    );
  } else {
    return refreshSignalSubject.pipe(
      filter((signal) => signal !== null),
      take(1),
      switchMap(() => proceedAndDecrypt(req, next, crypto)),
    );
  }
}
