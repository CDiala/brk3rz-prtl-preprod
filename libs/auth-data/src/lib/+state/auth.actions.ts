import { createAction, props } from '@ngrx/store';
import { AuthEntity, getUserMeSuccessResponse, uploadLicenceSuccessResponse, userNameData, userSuccessResponse } from './auth.models';
import {
  AuthRequest,
  AuthResponse,
  BaseResponse,
  RegisterRequest,
  ResetLinkInfo,
  UpdatePasswordRequest,
  UserInfo,
} from '@insurFlow/core';
import { AuthState } from './auth.reducer';

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

export const getNameUser = createAction(
  '[Auth/API] Get User Name',
  props<{ userId: string }>(),
);

export const getNameUserSuccess = createAction(
  '[Auth/API] Get User Name Success',
  props<{ res: userSuccessResponse }>(),
);

export const getNameUserFailure = createAction(
  '[Auth/API] Get User Name Failure',
  props<{ error: any }>(),
);

export const loginUserSuccess = createAction(
  '[Auth/API] Login User Success',
  props<{ visitor: AuthResponse | null }>(),
);

export const loginUserFailure = createAction(
  '[Auth/API] Login User Failure',
  props<{ error: any }>(),
);

export const getRoleUsers = createAction(
  '[Auth/API] Get Role Users',
  props<{ data: string }>(),
);

export const register = createAction(
  '[Auth/API] Register',
  props<{ data: RegisterRequest }>(),
);

export const registerSuccess = createAction(
  '[Auth/API] Register Success',
  props<{ response: any }>(), // TODO: BUILD AN INTERFACE FOR THIS
);

export const registerFailure = createAction(
  '[Auth/API] Register Failure',
  props<{ error: any }>(),
);

export const updatePassword = createAction(
  '[Auth/API] Update Password',
  props<{ data: UpdatePasswordRequest }>(),
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

export const clearAuthError = createAction(
  '[Auth] Clear Auth Error'
);

export const getUserIdError = createAction(
  '[Auth] Get User ID Error',
  props<{ userId: string | null }>()
);

export const restoreState = createAction(
  '[App Initialization] Restore State',
  props<{ global: Partial<AuthState> }>() // Accept partial state to allow flexibility
);

export const uploadLicence = createAction(
  '[Auth/API] Upload Licence',
  props<{ formData: FormData }>(),
);

export const uploadLicenceSuccess = createAction(
  '[Auth/API] Upload Licence Success',
  props<{ response: uploadLicenceSuccessResponse }>(), // TODO: BUILD AN INTERFACE FOR THIS
);

export const uploadLicenceFailure = createAction(
  '[Auth/API] Upload Licence Failure',
  props<{ error: any }>(),
);

export const getUserMeSuccess = createAction(
  '[Auth/API] Get User Me Success',
  props<{ userMe: getUserMeSuccessResponse }>(),
);