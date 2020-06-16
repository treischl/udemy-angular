import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

@Injectable({ providedIn: "root" })
export class AuthService {
  tokenExpirationTimer: number;

  constructor(private store: Store<fromApp.AppState>) {}

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = window.setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (Boolean(this.tokenExpirationTimer)) {
      window.clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
