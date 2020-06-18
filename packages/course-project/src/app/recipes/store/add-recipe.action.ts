import { Action } from "@ngrx/store";

import { Recipe } from "../recipe.model";
import { State } from "./recipe.reducer";

export const ADD_RECIPE = "[recipes] ADD_RECIPE";

export class AddRecipe implements Action {
  readonly type = ADD_RECIPE;

  constructor(public payload: Recipe) {}
}

export function addRecipeFn(state: State, action: AddRecipe) {
  return {
    ...state,
    recipes: [...state.recipes, action.payload],
  };
}
