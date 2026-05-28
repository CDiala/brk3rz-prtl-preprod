import { Store, select } from '@ngrx/store';
import { filter } from 'rxjs/operators'; // Switch from skip to filter
import { StatePersistenceService } from '../services/state-persistence.service';
import { AuthState } from './auth.reducer';
import { restoreState } from './auth.actions';
import { isPlatformBrowser } from '@angular/common';
import { AppState } from './app.state';

export function initializeApp(
  store: Store<AppState>,
  statePersistenceService: StatePersistenceService,
  platformId: object
): void {
  if (!isPlatformBrowser(platformId)) {
    return; 
  }

  // 1. Read and dispatch to NgRx synchronously.
  // Because actions are processed instantly by the reducer, the state updates IMMEDIATELY.
  const initialState = statePersistenceService.loadStateFromSessionStorage();
  if (initialState) {
    store.dispatch(
      restoreState({ global: initialState as unknown as AuthState })
    );
  }

  // 2. Set up the subscription SYNCHRONOUSLY without a Promise wrapper.
store
  .pipe(
    select((state) => state.auth),
    filter((authState) => !!authState)
  )
  .subscribe((authState) => {
    // Cast to unknown first, then to Record<string, unknown> to satisfy the strict signature check safely
    const savePayload = authState as unknown as Record<string, unknown>;
    statePersistenceService.saveStateToSessionStorage(savePayload);
  });
}