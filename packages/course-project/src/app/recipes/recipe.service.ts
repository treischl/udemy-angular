import { Injectable } from "@angular/core";

import { Recipe } from "./recipe.model";
import { DataStorageService } from "../shared/data-storage.service";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { tap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class RecipeService {
  private _recipes: Recipe[] = [];

  constructor(
    private shoppingListService: ShoppingListService,
    private dataStorageService: DataStorageService,
  ) {}

  public get recipes() {
    return this._recipes.slice();
  }

  public getRecipe(index: number) {
    return this._recipes[index];
  }

  public addIngredientsToShoppingList(recipe: Recipe) {
    this.shoppingListService.addIngredients(recipe.ingredients);
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
