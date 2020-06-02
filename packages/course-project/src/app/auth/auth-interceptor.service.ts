import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from "@angular/common/http";
import { AuthService } from "./auth.service";
import { take, exhaustMap } from "rxjs/operators";
import { User } from "./user.model";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
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
