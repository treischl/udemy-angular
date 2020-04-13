import { Component } from "@angular/core";

import { UsersService } from "./users.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  get activeUsers() {
    return this.usersService.activeUsers;
  }
  get inactiveUsers() {
    return this.usersService.inactiveUsers;
  }

  constructor(private usersService: UsersService) {}
}
