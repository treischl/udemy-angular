import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError, BehaviorSubject } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { User } from "./user.model";

export interface SignupResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

interface LoginResponseData extends SignupResponseData {
  registered: boolean;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {}

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
    return this.user.next(
      new User(
        email,
        userId,
        token,
        new Date(new Date().getTime() + expiresIn),
      ),
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
}
