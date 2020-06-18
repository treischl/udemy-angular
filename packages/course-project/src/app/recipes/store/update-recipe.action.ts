import { Action } from "@ngrx/store";

import { Recipe } from "../recipe.model";
import { State } from "./recipe.reducer";

export const UPDATE_RECIPE = "[recipes] UPDATE_RECIPE";

export class UpdateRecipe implements Action {
  readonly type = UPDATE_RECIPE;

  constructor(public payload: { index: number; newRecipe: Recipe }) {}
}

export function updateRecipeFn(state: State, action: UpdateRecipe) {
  return {
    ...state,
    recipes: [
      ...state.recipes.slice(0, action.payload.index),
      { ...action.payload.newRecipe },
      ...state.recipes.slice(action.payload.index + 1),
    ],
  };
}
