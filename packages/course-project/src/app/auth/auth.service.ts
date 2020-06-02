import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { environment } from "../../environments/environment";

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
      .pipe(catchError(this.handleError));
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
      .pipe(catchError(this.handleError));
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
