import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from "@angular/common/http";
import { Store } from "@ngrx/store";
import { take, exhaustMap, map } from "rxjs/operators";

import { User } from "./user.model";
import * as fromApp from "../store/app.reducer";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select("auth").pipe(
      take(1),
      map((authState) => authState.user),
      exhaustMap((user) => next.handle(this.modifyReq(req, user))),
    );
  }

  private modifyReq(request: HttpRequest<any>, user: User) {
    return request.clone({
      params: Boolean(user)
        ? new HttpParams().set("auth", user.token)
        : undefined,
    });
  }
}
