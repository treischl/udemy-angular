import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";

import { ServersService } from "../servers.service";

export type Server = { id: number; name: string; status: string };

@Injectable()
export class ServerResolver implements Resolve<Server> {
  constructor(private serversService: ServersService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Server | Observable<Server> | Promise<Server> {
    const id = Number(route.params["id"]);
    return this.serversService.getServer(id);
  }
}
