import { Component } from "@angular/core";

import { ShoppingListService } from "./shopping-list.service";

@Component({
  selector: "app-shopping-list",
  templateUrl: "./shopping-list.component.html",
  styleUrls: ["./shopping-list.component.css"],
})
export class ShoppingListComponent {
  public get ingredients() {
    return this.shoppingListService.ingredients;
  }

  constructor(private shoppingListService: ShoppingListService) {}
}
