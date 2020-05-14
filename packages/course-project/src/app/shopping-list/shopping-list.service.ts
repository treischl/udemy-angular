import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";

@Injectable({ providedIn: "root" })
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  private _ingredients: Ingredient[] = [
    new Ingredient("Apples", 5),
    new Ingredient("Tomatoes", 10),
  ];

  public get ingredients() {
    return this._ingredients.slice();
  }

  public getIngredient(index: number) {
    return this.ingredients[index];
  }

  public addIngredient(ingredient: Ingredient) {
    this._ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients);
  }

  public addIngredients(ingredients: Ingredient[]) {
    this._ingredients.push(...ingredients);
  }

  public updateIngredient(index: number, newIngredient: Ingredient) {
    this._ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients);
  }

  public deleteIngredient(index: number) {
    this._ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients);
  }
}
