/* eslint-disable @nx/enforce-module-boundaries */
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthEntity, getUserMeSuccessResponse, uploadLicenceSuccessResponse, userAuthId, userSuccessResponse } from './auth.models';
import { AuthResponse, BaseResponse, ResetLinkInfo, UserInfo } from '@insurFlow/core';
import { BackendError } from 'libs/auth/src/lib/components/login/login';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState extends EntityState<AuthEntity> {
  selectedId?: string | number; // which Auth record has been selected
  loaded: boolean; // has the Auth list been loaded
  error?: string | null; // last known error (if any)
  visitor?: AuthResponse | null; // info about the currently logged in user
  resetLinkInfo: ResetLinkInfo | null; // email used for password reset
  isPasswordUpdated: boolean | null;
  koi: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  specialError: BackendError | null;
  userId: userAuthId | null;
  usernameRes: userSuccessResponse | null;
  uploadLicenceRes: uploadLicenceSuccessResponse | null;
  getUserMe: getUserMeSuccessResponse | null;
}

export interface AuthPartialState {
  readonly [AUTH_FEATURE_KEY]: AuthState;
}

export const authAdapter: EntityAdapter<AuthEntity> =
  createEntityAdapter<AuthEntity>();

export const initialAuthState: AuthState = authAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  resetLinkInfo: null,
  isPasswordUpdated: null,
  koi: null,
  accessToken: null,
  refreshToken: null,
  specialError: null,
  userId: null,
  usernameRes: null,
  uploadLicenceRes: null,
  getUserMe: null,
});

const reducer = createReducer(
  initialAuthState,
  on(AuthActions.initAuth, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
    on(AuthActions.restoreState, (state, { global }) => ({
    ...state,
    ...global, // Merge the restored state with the current state
  })),
  on(AuthActions.loadAuthSuccess, (state, { auth }) =>
    authAdapter.setAll(auth, { ...state, loaded: true }),
  ),
  on(AuthActions.loadAuthFailure, (state, { error }) => ({ ...state, error })),
  on(AuthActions.getPublicKeySuccess, (state, { koi }) => ({
    ...state,
    error: null,
    koi,
  })),
  on(AuthActions.getPublicKeyFailure, (state, { error }) => ({
    ...state,
    error,
    koi: null,
  })),
  on(AuthActions.getAccessTokenSuccess, (state, { accessToken }) => ({
    ...state,
    error: null,
    accessToken,
  })),
  on(AuthActions.getAccessTokenFailure, (state, { error }) => ({
    ...state,
    error,
    accessToken: null,
  })),
  on(AuthActions.getRefreshTokenSuccess, (state, { refreshToken }) => ({
    ...state,
    error: null,
    refreshToken,
  })),
  on(AuthActions.getRefreshTokenFailure, (state, { error }) => ({
    ...state,
    error,
    refreshToken: null,
  })),
  on(AuthActions.loginUserSuccess, (state, { visitor }) => ({
    ...state,
    error: null,
    visitor,
    loaded: true,
  })),
  on(AuthActions.loginUserFailure, (state, { error }) => ({
    ...state,
    visitor: null,
    loaded: false,
    error,
    specialError: error as BackendError, // Capture the structured error for more detailed handling
  })),
  on(AuthActions.updatePasswordSuccess, (state, { response }) => ({
    ...state,
    isPasswordUpdated: response,
    error: null,
  })),
  on(AuthActions.updatePasswordFailure, (state, { error }) => ({
    ...state,
    isPasswordUpdated: false,
    error,
  })),
  on(AuthActions.sendResetLinkSuccess, (state, { info }) => ({
    ...state,
    resetLinkInfo: { ...info },
    error: null,
  })),
  on(AuthActions.sendResetLinkFailure, (state, { error }) => ({
    ...state,
    resetLinkInfo: null,
    error,
  })),
on(AuthActions.clearAuthError, (state) => ({
  ...state,
  error: null,
  specialError: null, // Reset both fields cleanly together,
  usernameData: null // Optional: clear it when cleaning up error states
})),
on(AuthActions.getUserIdError, (state, { userId }) => ({
  ...state,
  userId: { userId },
})),
on(AuthActions.getNameUserSuccess, (state, { res }) => ({
  ...state,
  usernameRes: res, // Saves the data payload cleanly to the state
  error: null, // Clear any previous errors on success
})),
on(AuthActions.getUserMeSuccess, (state, { userMe }) => ({
  ...state,
  getUserMe: userMe, // Saves the data payload cleanly to the state
  error: null, // Clear any previous errors on success
})),
on(AuthActions.uploadLicenceSuccess, (state, { response }) => ({
  ...state,
  uploadLicenceRes: response, // Saves the data payload cleanly to the state
  error: null, // Clear any previous errors on success
})),
)

export function authReducer(state: AuthState | undefined, action: Action) {
  return reducer(state, action);
}
