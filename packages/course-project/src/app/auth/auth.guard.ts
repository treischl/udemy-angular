import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Store } from "@ngrx/store";
import { map, take } from "rxjs/operators";

import * as fromApp from "../store/app.reducer";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store<fromApp.AppState>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select("auth").pipe(
      take(1),
      map((authState) => authState.user),
      map((user) => Boolean(user) || this.router.createUrlTree(["/auth"])),
    );
  }
}
