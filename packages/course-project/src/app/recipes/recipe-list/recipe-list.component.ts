import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";

import * as fromApp from "../../store/app.reducer";
import { Recipe } from "../recipe.model";

@Component({
  selector: "app-recipe-list",
  templateUrl: "./recipe-list.component.html",
  styleUrls: ["./recipe-list.component.css"],
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.subscription = this.store
      .select("recipes")
      .pipe(map((recipesState) => recipesState.recipes))
      .subscribe((recipes) => {
        this.recipes = recipes;
      });
  }
}
