import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import * as fromApp from "../store/app.reducer";
import { Ingredient } from "../shared/ingredient.model";
import * as ShoppingListActions from "./store/shopping-list.actions";

@Component({
  selector: "app-shopping-list",
  templateUrl: "./shopping-list.component.html",
  styleUrls: ["./shopping-list.component.css"],
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(private store: Store<fromApp.AppState>) {}

  onEditItem(index: number) {
    this.store.dispatch(ShoppingListActions.startEdit({ index }));
  }

  ngOnInit(): void {
    this.ingredients = this.store.select("shoppingList");
  }
}
