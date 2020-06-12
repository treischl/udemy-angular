import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription, Observable } from "rxjs";

import { ShoppingListService } from "./shopping-list.service";
import { Ingredient } from "../shared/ingredient.model";

@Component({
  selector: "app-shopping-list",
  templateUrl: "./shopping-list.component.html",
  styleUrls: ["./shopping-list.component.css"],
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>,
  ) {}

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
  }

  ngOnInit(): void {
    this.ingredients = this.store.select("shoppingList");
  }
}
