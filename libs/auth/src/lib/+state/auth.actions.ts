import { createAction, props } from '@ngrx/store';
import { AuthEntity } from './auth.models';
import {
  AuthRequest,
  BaseResponse,
  ResetLinkInfo,
  UpdatePasswordRequest,
  UserInfo,
} from '@insurFlow/core';

export const initAuth = createAction('[Auth Page] Init');

export const loadAuthSuccess = createAction(
  '[Auth/API] Load Auth Success',
  props<{ auth: AuthEntity[] }>(),
);

export const loadAuthFailure = createAction(
  '[Auth/API] Load Auth Failure',
  props<{ error: any }>(),
);

export const getPublicKey = createAction('[Auth/API] Public Key');

export const getPublicKeySuccess = createAction(
  '[Auth/API] Public Key Success',
  props<{ koi: string }>(),
);

export const getPublicKeyFailure = createAction(
  '[Auth/API] Public Key Failure',
  props<{ error: any }>(),
);

export const getAccessToken = createAction('[Auth/API] Access Token');

export const getAccessTokenSuccess = createAction(
  '[Auth/API] Access Token Success',
  props<{ accessToken: string }>(),
);

export const getAccessTokenFailure = createAction(
  '[Auth/API] Access Token Failure',
  props<{ error: any }>(),
);

export const getRefreshToken = createAction('[Auth/API] Refresh Token');

export const getRefreshTokenSuccess = createAction(
  '[Auth/API] Refresh Token Success',
  props<{ refreshToken: string }>(),
);

export const getRefreshTokenFailure = createAction(
  '[Auth/API] Refresh Token Failure',
  props<{ error: any }>(),
);

export const loginUser = createAction(
  '[Auth/API] Login User',
  props<{ credentials: AuthRequest }>(),
);

export const loginUserSuccess = createAction(
  '[Auth/API] Login User Success',
  props<{ visitor: BaseResponse<UserInfo | null> }>(),
);

export const loginUserFailure = createAction(
  '[Auth/API] Login User Failure',
  props<{ error: any }>(),
);

export const updatePassword = createAction(
  '[Auth/API] Update Password',
  props<{ data: UpdatePasswordRequest; isRegister: boolean }>(),
);

export const updatePasswordSuccess = createAction(
  '[Auth/API] Update Password Success',
  props<{ response: boolean }>(),
);

export const updatePasswordFailure = createAction(
  '[Auth/API] Update Password Failure',
  props<{ error: any }>(),
);

export const sendResetLink = createAction(
  '[Auth/Page] Send Password Reset Link',
  props<{ email: string }>(),
);

export const sendResetLinkSuccess = createAction(
  '[Auth/Page] Send Password Reset Link Success',
  props<{ info: ResetLinkInfo }>(),
);

export const sendResetLinkFailure = createAction(
  '[Auth/Page] Send Password Reset Link Failure',
  props<{ error: any }>(),
);

export const logout = createAction('[Auth/Page] Logout');
