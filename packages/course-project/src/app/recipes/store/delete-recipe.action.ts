import { Action } from "@ngrx/store";

import { State } from "./recipe.reducer";

export const DELETE_RECIPE = "[recipes] DELETE_RECIPE";

export class DeleteRecipe implements Action {
  readonly type = DELETE_RECIPE;

  constructor(public payload: number) {}
}

export function deleteRecipeFn(state: State, action: DeleteRecipe) {
  return {
    ...state,
    recipes: [
      ...state.recipes.slice(0, action.payload),
      ...state.recipes.slice(action.payload + 1),
    ],
  };
}
