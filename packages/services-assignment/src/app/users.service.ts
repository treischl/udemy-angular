import { Injectable } from "@angular/core";

import { CounterService } from "./counter.service";

@Injectable({ providedIn: "root" })
export class UsersService {
  activeUsers = ["Max", "Anna"];
  inactiveUsers = ["Chris", "Manu"];

  constructor(private counterService: CounterService) {}

  deactivateUser(activeUserId: number) {
    this.inactiveUsers.push(...this.activeUsers.splice(activeUserId, 1));
    this.incrementCounter();
  }

  activateUser(inactiveUserId: number) {
    this.activeUsers.push(...this.inactiveUsers.splice(inactiveUserId, 1));
    this.incrementCounter();
  }

  private incrementCounter() {
    this.counterService.increment();
    console.log(this.counterService.current);
  }
}
