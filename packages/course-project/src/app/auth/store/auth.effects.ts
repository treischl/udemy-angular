import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { of } from "rxjs";
import { switchMap, catchError, map, tap, filter } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { AuthService } from "../auth.service";
import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

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
  return AuthActions.authenticateSuccess({
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
    AuthActions.authenticateFail({
      errorMessage: getErrorText(errorResp?.error?.error?.message),
    }),
  );
}

@Injectable()
export class AuthEffects {
  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      switchMap((action) =>
        this.http
          .post<SignupResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
            {
              email: action.email,
              password: action.password,
              returnSecureToken: true,
            },
          )
          .pipe(
            tap((respData) => {
              this.authService.setLogoutTimer(
                Number(respData.expiresIn) * 1000,
              );
            }),
            map(handleAuthSuccess),
            catchError(handleAuthFail),
          ),
      ),
    ),
  );

  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap((action) =>
        this.http
          .post<LoginResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
            {
              email: action.email,
              password: action.password,
              returnSecureToken: true,
            },
          )
          .pipe(
            tap((respData) => {
              this.authService.setLogoutTimer(
                Number(respData.expiresIn) * 1000,
              );
            }),
            map(handleAuthSuccess),
            catchError(handleAuthFail),
          ),
      ),
    ),
  );

  authRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authenticateSuccess),
        filter((authSuccessAction) => authSuccessAction.redirect),
        tap(() => {
          this.router.navigate(["/"]);
        }),
      ),
    { dispatch: false },
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
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
          return AuthActions.authenticateSuccess({
            email,
            userId,
            token,
            expirationDate: new Date(expirationDate),
            redirect: false,
          });
        }
        return { type: "DUMMY" };
      }),
    ),
  );

  authLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem("userData");
          this.router.navigate(["/auth"]);
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) {}
}
