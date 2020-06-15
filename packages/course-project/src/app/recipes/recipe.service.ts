import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { tap } from "rxjs/operators";

import { Recipe } from "./recipe.model";
import { DataStorageService } from "../shared/data-storage.service";
import * as ShoppingListActions from "../shopping-list/store/shopping-list.actions";
import * as fromApp from "../store/app.reducer";

@Injectable({ providedIn: "root" })
export class RecipeService {
  private _recipes: Recipe[] = [];

  constructor(
    private dataStorageService: DataStorageService,
    private store: Store<fromApp.AppState>,
  ) {}

  public get recipes() {
    return this._recipes.slice();
  }

  public getRecipe(index: number) {
    return this._recipes[index];
  }

  public addIngredientsToShoppingList(recipe: Recipe) {
    this.store.dispatch(
      new ShoppingListActions.AddIngredients(recipe.ingredients),
    );
  }

  addRecipe(recipe: Recipe) {
    this._recipes.push(recipe);
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this._recipes[index] = newRecipe;
  }

  deleteRecipe(index: number) {
    this._recipes.splice(index, 1);
  }

  loadRecipes() {
    return this.dataStorageService.fetchRecipes().pipe(
      tap((recipes) => {
        this._recipes = recipes;
      }),
    );
  }

  saveRecipes() {
    this.dataStorageService.storeRecipes(this._recipes);
  }
}
