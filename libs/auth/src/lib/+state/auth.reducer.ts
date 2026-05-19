import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthEntity } from './auth.models';
import { BaseResponse, ResetLinkInfo, UserInfo } from '@insurFlow/core';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState extends EntityState<AuthEntity> {
  selectedId?: string | number; // which Auth record has been selected
  loaded: boolean; // has the Auth list been loaded
  error?: string | null; // last known error (if any)
  visitor?: BaseResponse<UserInfo | null> | null; // info about the currently logged in user
  resetLinkInfo: ResetLinkInfo | null; // email used for password reset
  isPasswordUpdated: boolean | null;
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
});

const reducer = createReducer(
  initialAuthState,
  on(AuthActions.initAuth, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(AuthActions.loadAuthSuccess, (state, { auth }) =>
    authAdapter.setAll(auth, { ...state, loaded: true }),
  ),
  on(AuthActions.loadAuthFailure, (state, { error }) => ({ ...state, error })),
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
);

export function authReducer(state: AuthState | undefined, action: Action) {
  return reducer(state, action);
}
