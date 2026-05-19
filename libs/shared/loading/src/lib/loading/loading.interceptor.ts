import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { map, catchError, throwError, finalize } from 'rxjs';
import { LoadingService } from './loading-service';

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  const loadingService: LoadingService = inject(LoadingService);
  const skipLoading = request.headers.has('X-Skip-Loading-Interceptor');

  if (skipLoading) {
    // Clone the request to remove the custom header before sending it to the server
    const modifiedRequest = request.clone({
      headers: request.headers.delete('X-Skip-Loading-Interceptor'),
    });
    return next(modifiedRequest);
  }
  // console.log('request.url', request.url);
  loadingService.setLoading(true, request.url);
  return next(request).pipe(
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // Hide loading indicator on successful response
        loadingService.setLoading(false, request.url);
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      // Hide loading indicator on error
      loadingService.setLoading(false, request.url);
      // Handle the error as needed
      // return throwError(() => new Error(error.message));
      return throwError(() => error);
    }),
    finalize(() => {
      // Always hide the loading indicator, regardless of success or error
      loadingService.setLoading(false, request.url);
    }),
  );
};
