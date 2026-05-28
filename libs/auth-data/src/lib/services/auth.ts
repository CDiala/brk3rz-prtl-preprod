import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  APP_CONFIG,
  AuthRequest,
  BaseResponse,
  AuthRole,
  LoggedInClient,
  UpdatePasswordRequest,
  UserInfo,
  getApiEndpoints,
  PublicKeyResponse,
  RegisterRequest,
  AuthResponse,
  sendResetLinkPayload,
  userMeResponse,
  sendResetLinkResponse,
} from '@insurFlow/core';
import {
  BehaviorSubject,
  delay,
  firstValueFrom,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import {
  getUserMeResData,
  getUserMeSuccessResponse,
  uploadLicenceSuccessResponse,
  userSuccessResponse,
} from '../+state/auth.models';
import { AppState } from '../+state/app.state';
import { Store } from '@ngrx/store';
// import { Encryption } from '@insurFlow/services';

@Injectable({ providedIn: 'root' })
export class Auth {
  private http: HttpClient = inject(HttpClient);
  private userSubject = new BehaviorSubject<AuthResponse | null>(null);
  private user: AuthResponse | null = null;
  private store: Store<AppState> = inject(Store);
  // private encryptionService = inject(Encryption);
  private config = inject(APP_CONFIG);
  private endpoints = getApiEndpoints(this.config.beBaseUrl);

  getPublicKey = async (): Promise<PublicKeyResponse | null> => {
    if (this.config.isDev) {
      // TODO: remove the exclamation
      return firstValueFrom(
        of({
          publicKey:
            '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5gLTqapdoCUZBAud2GSE\nJW0tXUf6FJDHMQS5D0+y3sov8wN+DxEpBUGFPKcbSm1KPt3FEXFqTAPLtcECedyw\nE+EojzXxG8/EZmfMLM51O9pfgWWsbg1l7ASyPm/DrVznCFubZp1WbzOgBOi0ZG/K\nTKRt34vgtQ/rnShwUeYsl49Wd5kFoQv8suaTyzOOBNKmxtgwxIFobVXZbQKHOKaZ\nQNjsdmTTFlx5lBFwR1DIrVzy2PdByIy2/GXvdRo2nynslgAcTdtuAXgX19jxEOHK\nP0XLzM7YRwESLm3905VifpE+fv+Jkw31Q/16RMu2T45k9IC7tTPoCE3GLu9XugaP\nAQIDAQAB\n-----END PUBLIC KEY-----',
        }).pipe(delay(2000)),
      );
    } else {
      return firstValueFrom(
        this.http.get<PublicKeyResponse | null>(
          this.endpoints.UserManagementAPI.getPublicKey,
        ),
      );
    }
  };

  refreshAccessToken = (): Observable<string | null> => {
    if (this.config.isDev) {
      // TODO: remove the exclamation
      return of(
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJjaGlidXpvLmRpYWxhIiwicm9sZSI6IkksTDEiLCJuYmYiOjE3NzczNjY0NTgsImV4cCI6MTc3NzM3MDA1OCwiaWF0IjoxNzc3MzY2NDU4fQ.Dfy8Jkp_q9f1s1boQFayGrpno5UnNTEFq0sOxIG-uo4BclFYaNBb1nnLPWNCJR5eJM68_yAP6815J326gURqwQ',
      ).pipe(delay(2000));
    } else {
      return this.http.get<string | null>(
        this.endpoints.UserManagementAPI.getPublicKey,
      );
    }
  };

 login = async (payload: AuthRequest): Promise<AuthResponse | null> => {
    if (this.config.isDev) {
      // TODO: remove the exclamation
      return firstValueFrom(
        of({
          code: '00',
          message: 'success',
          data: {
            userId: 'b829bc61ca94414d8abb2b930bba929c',
            accessExpiresAt: '2026-05-26T17:36:33.8143159+00:00',
            refreshExpiresAt: '2026-05-26T18:26:33.8143483+00:00',
          },
        }).pipe(delay(2000)),
      );
    } else {
      console.log('payload', payload);
      // // eslint-disable-next-line no-debugger
      // debugger;

      return firstValueFrom(
        this.http.post<AuthResponse | null>(
          this.endpoints.UserManagementAPI.login,
          payload,
        ),
      ).then((response) => {
        if (response) {
          this.emitData(response); // Or this.emitData.next(response) if it's a Subject
        }
        return response;
      });
    }
  };

  emitData(value: AuthResponse | null) {
    this.userSubject.next(value);
  }

  dataListener() {
    return this.userSubject.asObservable();
  }

  getUserState(): Observable<UserInfo | null> {
    return this.dataListener().pipe(
      switchMap(
        (res) => (res?.data ? of(res.data) : this.getAppState()), // Fallback to app state
      ),
    );
  }
    isAuthenticated(): Observable<boolean> {
    return this.getUserState().pipe(map((user) => !!user));
  }

  // Assuming getAppState method uses a selector to fetch credentials
  private getAppState(): Observable<UserInfo | null> {
    return this.store.select((state) => state.auth.visitor?.data || null);
  }

  register = (
    payload: RegisterRequest,
  ): Promise<BaseResponse<boolean | null>> => {
    if (this.config.isDev) {
      return firstValueFrom(
        of({
          code: '-98',
          message: 'Invalid Operation',
          data: false,
        }),
      );
    } else {
      // const newUrl = new URL(this.endpoints.UserManagementAPI.register);

      return firstValueFrom(
        this.http.post<BaseResponse<boolean | null>>(
          this.endpoints.UserManagementAPI.register,
          payload,
        ),
      );
    }
  };

  getRoleUser = (payload: object): Promise<getUserMeSuccessResponse> => {
    if (this.config.isDev) {
      return firstValueFrom(
        of({
          code: '-98',
          message: 'Invalid Operation',
          data: {
            id: 'dfgdgdc',
            companyName: 'Acme Brokers Ltd',
            registrationNumber: 'RC123456',
            userName: 'chibuzor',
            emailAddress: 'Chibuzo.Diala@zenithinsurance.com.ng',
            address: '1 Main St',
            state: 'Lagos',
            lga: 'Ikeja',
            directorName: 'Jane Doe',
            contactNumbers: '08031234567',
            tin: 'TIN123456',
          },
        }),
      );
    } else {
      return firstValueFrom(
        this.http.post<getUserMeSuccessResponse>(
          this.endpoints.UserManagementAPI.authMe,
          payload,
        ),
      );
    }
  };

  sendResetLink = (
    payload: sendResetLinkPayload,
  ): Promise<sendResetLinkResponse<boolean | null>> => {
    if (this.config.isDev) {
      return firstValueFrom(
        of({
          code: '-98',
          message: 'Invalid Operation',
          data: false,
        }),
      );
      // return firstValueFrom(
      //   of({
      //     code: '00',
      //     message: 'Successful',
      //     data: true,
      //   }),
      // );
    } else {
      const newUrl = this.endpoints.UserManagementAPI.sendResetLink;

      return firstValueFrom(
        this.http.post<sendResetLinkResponse<boolean | null>>(newUrl, payload),
      );
    }
  };
  updatePassword = async (
    payload: UpdatePasswordRequest,
  ): Promise<BaseResponse<boolean>> => {
    if (this.config.isDev) {
      // return firstValueFrom(
      //   of({
      //     code: '-98',
      //     message: 'Incorrect OTP',
      //     data: false,
      //   }),
      return firstValueFrom(
        of({
          code: '00',
          message: 'string',
          data: true,
        }),
      );
    } else {
      return firstValueFrom(
        this.http.post<BaseResponse<boolean>>(
          this.endpoints.UserManagementAPI.resetPassword,
          payload,
        ),
      );
    }
  };

  /** */
  /** UNUSED METHODS BELOW */
  /** */

  getRole = async (payload: AuthRole): Promise<AuthRole> => {
    if (this.config.isDev) {
      return firstValueFrom(
        of({
          id: 0,
          email: 'abimbola1.sarumi@zenithinsurance.com.ng',
          name: 'string',
          phoneNumber: 'string',
          credential: 'string',
          changed: true,
          lastLogin: '2025-11-19T16:47:48.99Z',
          createDate: '2025-11-19T16:47:48.99Z',
          otp: 'string',
          otP_Start: '2025-11-19T16:47:48.99Z',
          otP_Expiration: '2025-11-19T16:47:48.99Z',
          userType: 0,
          ermGroup: false,
          qmsInitiator: false,
          qmsApprover: true,
        }),
      );
      // return firstValueFrom(
      //   of({
      //     id: 0,
      //     email: 'sodiq.alabi@zenithinsurance.com.ng',
      //     name: 'string',
      //     phoneNumber: 'string',
      //     credential: 'string',
      //     changed: true,
      //     lastLogin: '2025-11-19T16:47:48.99Z',
      //     createDate: '2025-11-19T16:47:48.99Z',
      //     otp: 'string',
      //     otP_Start: '2025-11-19T16:47:48.99Z',
      //     otP_Expiration: '2025-11-19T16:47:48.99Z',
      //     userType: 0,
      //     ermGroup: false,
      //     qmsInitiator: false,
      //     qmsApprover: false,
      //   })
      // );
    } else {
      return firstValueFrom(
        this.http.post<AuthRole>(
          this.endpoints.UserManagementAPI.roleRequestUrl,
          payload,
        ),
      );
    }
  };

  getUserNameEP = async (
    payload: string,
  ): Promise<userSuccessResponse | null> => {
    if (!this.config.isDev) {
      return firstValueFrom(
        of({
          code: '00',
          message: 'string',
          data: {
            companyName: 'Zenith Insurance',
          },
        }),
      );
    } else {
      console.log('payload', payload);

      // 1. If {userId} is a path template parameter inside the endpoint string, replace it directly
      const updatedEndpoint =
        this.endpoints.UserManagementAPI.getUserName.replace(
          '{userId}',
          payload,
        );
      const newUrl = new URL(updatedEndpoint);

      // 2. Separate the configuration from the immediate return execution block
      // (If you actually needed query params, you would do: newUrl.searchParams.set('userId', payload); here)

      // 3. Keep ONLY the HttpClient Observable inside the firstValueFrom method wrapper
      return firstValueFrom(
        this.http.get<userSuccessResponse>(newUrl.toString()),
      );
    }
  };

  uploadLicenceEP = async (
    formData: FormData,
  ): Promise<uploadLicenceSuccessResponse | null> => {
    if (!this.config.isDev) {
      return firstValueFrom(
        of({
          code: '00',
          message: 'string',
          data: null,
        }),
      );
    } else {
      console.log('formData', formData);

      // 1. If {userId} is a path template parameter inside the endpoint string, replace it directly
      const updatedEndpoint = this.endpoints.UserManagementAPI.uploadLicence;

      // 2. Separate the configuration from the immediate return execution block
      // (If you actually needed query params, you would do: newUrl.searchParams.set('userId', payload); here)

      // 3. Keep ONLY the HttpClient Observable inside the firstValueFrom method wrapper
      return firstValueFrom(
        this.http.post<uploadLicenceSuccessResponse>(updatedEndpoint, formData),
      );
    }
  };

  getToken = () => {
    // TODO: implement later
    try {
      return true;
      // const clientInfo = this.getUserFromStorage();

      // const decryptedUser = this.encryptionService.decrypt(
      //   clientInfo,
      // ) as LoggedInClient;

      // // console.log('encUser', decryptedUser);

      // const isLoggedIn = decryptedUser.isLoggedIn || false;

      // return isLoggedIn;
    } catch (error) {
      return false;
    }
  };

  getUserFromStorage = () => {
    try {
      const clientInfo = localStorage.getItem('qx_c:id') || '';

      return clientInfo;
    } catch (error) {
      return '';
    }
  };

  decryptUser = (data: string) => {
    // return this.encryptionService.decrypt(data) as LoggedInClient;
    return {} as LoggedInClient;
  };

  getUser = () => {
    try {
      const clientInfo = this.getUserFromStorage();

      // TODO: fix this later
      // const decryptedUser = this.encryptionService.decrypt(
      //   clientInfo,
      // ) as LoggedInClient;

      const decryptedUser = {} as LoggedInClient;

      // console.log('decryptedUser', decryptedUser);

      return decryptedUser;
    } catch (error) {
      return null;
    }
  };

  clearUserData = () => {
    localStorage.clear();
  };
}
