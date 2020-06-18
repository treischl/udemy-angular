import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { of } from "rxjs";
import { switchMap, catchError, map, tap, filter } from "rxjs/operators";

import * as AuthActions from "./auth.actions";
import { environment } from "../../../environments/environment";
import { User } from "../user.model";
import { AuthService } from "../auth.service";

interface SignupResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

interface LoginResponseData extends SignupResponseData {
  registered: boolean;
}

type UserData = {
  email: string;
  userId: string;
  token: string;
  expirationDate: string;
};

function handleAuthSuccess({
  email,
  localId: userId,
  idToken: token,
  expiresIn,
}: SignupResponseData) {
  const expirationDate = new Date(
    new Date().getTime() + Number(expiresIn) * 1000,
  );
  localStorage.setItem(
    "userData",
    JSON.stringify({ email, userId, token, expirationDate }),
  );
  return new AuthActions.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate,
    redirect: true,
  });
}

function handleAuthFail(errorResp: HttpErrorResponse) {
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
  return of(
    new AuthActions.AuthenticateFail(
      getErrorText(errorResp?.error?.error?.message),
    ),
  );
}

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) =>
      this.http
        .post<SignupResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
          {
            ...signupAction.payload,
            returnSecureToken: true,
          },
        )
        .pipe(
          tap((respData) => {
            this.authService.setLogoutTimer(Number(respData.expiresIn) * 1000);
          }),
          map(handleAuthSuccess),
          catchError(handleAuthFail),
        ),
    ),
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) =>
      this.http
        .post<LoginResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
          {
            ...authData.payload,
            returnSecureToken: true,
          },
        )
        .pipe(
          tap((respData) => {
            this.authService.setLogoutTimer(Number(respData.expiresIn) * 1000);
          }),
          map(handleAuthSuccess),
          catchError(handleAuthFail),
        ),
    ),
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType<AuthActions.AuthenticateSuccess>(AuthActions.AUTHENTICATE_SUCCESS),
    filter((authSuccessAction) => authSuccessAction.payload.redirect),
    tap(() => {
      this.router.navigate(["/"]);
    }),
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const { email, userId, token, expirationDate }: UserData =
        JSON.parse(localStorage.getItem("userData")) || {};
      const savedUser = new User(
        email,
        userId,
        token,
        new Date(expirationDate),
      );
      if (Boolean(savedUser.token)) {
        this.authService.setLogoutTimer(
          new Date(expirationDate).getTime() - new Date().getTime(),
        );
        return new AuthActions.AuthenticateSuccess({
          email,
          userId,
          token,
          expirationDate: new Date(expirationDate),
          redirect: false,
        });
      }
      return { type: "DUMMY" };
    }),
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem("userData");
      this.router.navigate(["/auth"]);
    }),
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) {}
}
