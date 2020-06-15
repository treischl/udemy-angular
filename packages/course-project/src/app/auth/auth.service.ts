import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { environment } from "../../environments/environment";
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

interface LoginResponseData extends SignupResponseData {
  registered: boolean;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  tokenExpirationTimer: number;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>,
  ) {}

  signup(email: string, password: string) {
    return this.http
      .post<SignupResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        },
      )
      .pipe(
        catchError(this.handleError),
        tap((respData) =>
          this.handleAuth(
            respData.email,
            respData.localId,
            respData.idToken,
            Number(respData.expiresIn) * 1000,
          ),
        ),
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<LoginResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        },
      )
      .pipe(
        catchError(this.handleError),
        tap((respData) =>
          this.handleAuth(
            respData.email,
            respData.localId,
            respData.idToken,
            Number(respData.expiresIn) * 1000,
          ),
        ),
      );
  }

  private handleAuth(
    email: string,
    userId: string,
    token: string,
    expiresIn: number,
  ) {
    const exprDate = new Date(new Date().getTime() + expiresIn);
    localStorage.setItem(
      "userData",
      JSON.stringify({ email, userId, token, exprDate }),
    );
    this.autoLogout(expiresIn);
    return this.store.dispatch(
      new AuthActions.Login({ email, userId, token, expirationDate: exprDate }),
    );
  }

  private handleError(errorResp: HttpErrorResponse) {
    const getErrorText = (errMsg: string) => {
      switch (errMsg) {
        case "EMAIL_EXISTS":
          return "This email already exists.";
        case "EMAIL_NOT_FOUND":
          return "This email does not exist.";
        case "INVALID_PASSWORD":
          return "Incorrect email/password combination.";
        default:
          return "An unknown error occurred";
      }
    };
    return throwError(getErrorText(errorResp?.error?.error?.message));
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(["/auth"]);
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
        new AuthActions.Login({
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
