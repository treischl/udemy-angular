import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, switchMap, tap } from "rxjs/operators";

import * as fromApp from "../../store/app.reducer";
import * as ShoppingListActions from "../../shopping-list/store/shopping-list.actions";
import * as RecipeActions from "../store/recipe.actions";
import { Recipe } from "../recipe.model";

@Component({
  selector: "app-recipe-detail",
  templateUrl: "./recipe-detail.component.html",
  styleUrls: ["./recipe-detail.component.css"],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>,
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((params) => Number(params["id"])),
        tap((id) => {
          this.id = id;
        }),
        switchMap((_) => this.store.select("recipes")),
        map((recipeState) => recipeState.recipes[this.id]),
      )
      .subscribe((recipe) => {
        this.recipe = recipe;
      });
  }

  public onAddToShoppingList() {
    this.store.dispatch(
      ShoppingListActions.addIngredients({
        ingredients: this.recipe.ingredients,
      }),
    );
  }

  public onDeleteRecipe() {
    this.store.dispatch(RecipeActions.deleteRecipe({ index: this.id }));
  }
}
