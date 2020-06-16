import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { switchMap, catchError, map, tap } from "rxjs/operators";

import * as AuthActions from "./auth.actions";
import { environment } from "../../../environments/environment";
import { of } from "rxjs";

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

@Injectable()
export class AuthEffects {
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
          map(
            (respData) =>
              new AuthActions.Login({
                email: respData.email,
                userId: respData.localId,
                token: respData.idToken,
                expirationDate: new Date(
                  new Date().getTime() + Number(respData.expiresIn) * 1000,
                ),
              }),
          ),
          catchError((error: HttpErrorResponse) => {
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
              new AuthActions.LoginFail(
                getErrorText(error?.error?.error?.message),
              ),
            );
          }),
        ),
    ),
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => {
      this.router.navigate(["/"]);
    }),
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
  ) {}
}
