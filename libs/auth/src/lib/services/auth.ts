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
} from '@insurFlow/core';
import { delay, firstValueFrom, of } from 'rxjs';
import { Encryption } from '@insurFlow/services';

@Injectable({ providedIn: 'root' })
export class Auth {
  private http: HttpClient = inject(HttpClient);
  private encryptionService = inject(Encryption);
  private config = inject(APP_CONFIG);
  private endpoints = getApiEndpoints(this.config.beBaseUrl);

  login = async (
    payload: AuthRequest,
  ): Promise<BaseResponse<UserInfo | null>> => {
    if (this.config.isDev) {
      // return firstValueFrom(
      //   of({
      //     code: null,
      //     message: null,
      //     data: {
      //       id: 0,
      //       username: null,
      //       userDept: null,
      //       userBranch: null,
      //       userEmail: null,
      //       passwordChanged: null,
      //       role: [],
      //       token: null,
      //     },
      //   }).pipe(delay(2000)),
      // );

      // TODO: remove the exclamation
      return firstValueFrom(
        of({
          code: '00',
          message: 'Login Successful',
          data: {
            id: 1,
            username: 'chibuzo.diala',
            userDept: 'InfoTech',
            userBranch: 'head office',
            userEmail: 'Chibuzo.Diala@zenithinsurance.com.ng',
            passwordChanged: null,
            role: ['I', 'L1'],
            token:
              'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJjaGlidXpvLmRpYWxhIiwicm9sZSI6IkksTDEiLCJuYmYiOjE3NzczNjY0NTgsImV4cCI6MTc3NzM3MDA1OCwiaWF0IjoxNzc3MzY2NDU4fQ.Dfy8Jkp_q9f1s1boQFayGrpno5UnNTEFq0sOxIG-uo4BclFYaNBb1nnLPWNCJR5eJM68_yAP6815J326gURqwQ',
          },
        }).pipe(delay(2000)),
      );

      // return firstValueFrom(
      //   of({
      //     code: '-99',
      //     message: 'username or password is incorrect',
      //     data: {
      //       id: 0,
      //       username: null,
      //       userDept: null,
      //       userBranch: null,
      //       userEmail: null,
      //       passwordChanged: null,
      //       role: [],
      //       token: null,
      //     },
      //   }).pipe(delay(2000)),
      // );
    } else {
      return firstValueFrom(
        this.http.post<BaseResponse<UserInfo | null>>(
          this.endpoints.UserManagementAPI.login,
          payload,
        ),
      );
    }
  };

  sendResetLink = (payload: string): Promise<BaseResponse<boolean | null>> => {
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
      const newUrl = new URL(this.endpoints.UserManagementAPI.sendResetLink);
      newUrl.searchParams.append('emailAddress', payload);

      return firstValueFrom(
        this.http.get<BaseResponse<boolean | null>>(newUrl.href),
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

  getToken = () => {
    try {
      const clientInfo = this.getUserFromStorage();

      const decryptedUser = this.encryptionService.decrypt(
        clientInfo,
      ) as LoggedInClient;

      // console.log('encUser', decryptedUser);

      const isLoggedIn = decryptedUser.isLoggedIn || false;

      return isLoggedIn;
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
    return this.encryptionService.decrypt(data) as LoggedInClient;
  };

  getUser = () => {
    try {
      const clientInfo = this.getUserFromStorage();

      const decryptedUser = this.encryptionService.decrypt(
        clientInfo,
      ) as LoggedInClient;

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
