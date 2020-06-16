import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import { User } from "./user.model";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

export interface SignupResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

type UserData = {
  email: string;
  userId: string;
  token: string;
  exprDate: string;
};

@Injectable({ providedIn: "root" })
export class AuthService {
  tokenExpirationTimer: number;

  constructor(private store: Store<fromApp.AppState>) {}

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    localStorage.removeItem("userData");
    if (Boolean(this.tokenExpirationTimer)) {
      window.clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const { email, userId, token, exprDate }: UserData =
      JSON.parse(localStorage.getItem("userData")) || {};
    const savedUser = new User(email, userId, token, new Date(exprDate));
    if (Boolean(savedUser.token)) {
      this.store.dispatch(
        new AuthActions.AuthenticateSuccess({
          email,
          userId,
          token,
          expirationDate: new Date(exprDate),
        }),
      );
      this.autoLogout(new Date(exprDate).getTime() - new Date().getTime());
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = window.setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
