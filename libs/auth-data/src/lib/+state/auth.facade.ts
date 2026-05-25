import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import * as AuthSelectors from './auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(AuthSelectors.selectAuthLoaded));
  allAuth$ = this.store.pipe(select(AuthSelectors.selectAllAuth));
  selectedAuth$ = this.store.pipe(select(AuthSelectors.selectEntity));
  loggedInUser$ = this.store.pipe(select(AuthSelectors.selectLoggedInUser));
  passwordResetLinkInfo$ = this.store.pipe(
    select(AuthSelectors.selectPasswordEmailInfo),
  );
  updatedPassword$ = this.store.pipe(
    select(AuthSelectors.selectPasswordUpdateStatus),
  );
  koi$ = this.store.pipe(select(AuthSelectors.selectKoi));
  accessKey$ = this.store.pipe(select(AuthSelectors.selectAccess));
  refreshKey$ = this.store.pipe(select(AuthSelectors.selectRefresh));

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(AuthActions.initAuth());
  }
}
