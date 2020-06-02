import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { environment } from "../../environments/environment";

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
      {
        email,
        password,
        returnSecureToken: true,
      },
      )
      .pipe(
        catchError((errorResp) => {
          let errMsg: string;

          switch (errorResp?.error?.error?.message) {
            case "EMAIL_EXISTS":
              errMsg = "This email already exists";
              break;
            default:
              errMsg = "An unknown error occurred";
              break;
          }

          return throwError(errMsg);
        }),
      );
  }
    );
  }
}
