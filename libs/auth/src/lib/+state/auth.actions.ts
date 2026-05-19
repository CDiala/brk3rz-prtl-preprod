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
