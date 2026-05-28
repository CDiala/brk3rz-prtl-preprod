/* eslint-disable @nx/enforce-module-boundaries */

import { AuthState } from "./auth.reducer";


export interface AppState {
  // TODO: Add more states as they come up
  auth: AuthState;
}
