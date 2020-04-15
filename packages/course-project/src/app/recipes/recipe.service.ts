import { Injectable, EventEmitter } from "@angular/core";

import { Recipe } from "./recipe.model";

@Injectable({ providedIn: "root" })
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private _recipes: Recipe[] = [
    new Recipe(
      "A Test Recipe",
      "This is simply a test",
      "https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg",
    ),
    new Recipe(
      "Another Test Recipe",
      "This is simply a test",
      "https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg",
    ),
  ];

  public get recipes() {
    return this._recipes.slice();
  }
}
