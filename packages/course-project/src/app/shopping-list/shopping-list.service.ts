import { Injectable } from "@angular/core";

import { Ingredient } from "../shared/ingredient.model";

@Injectable({ providedIn: "root" })
export class ShoppingListService {
  private _ingredients: Ingredient[] = [
    new Ingredient("Apples", 5),
    new Ingredient("Tomatoes", 10),
  ];

  public get ingredients() {
    return this._ingredients.slice();
  }

  public addIngredient(ingredient: Ingredient) {
    this._ingredients.push(ingredient);
  }

  public addIngredients(ingredients: Ingredient[]) {
    this._ingredients.push(...ingredients);
  }
}
