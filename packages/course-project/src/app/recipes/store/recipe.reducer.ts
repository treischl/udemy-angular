import { createReducer, on, Action } from "@ngrx/store";

import { Recipe } from "../recipe.model";
import * as RecipeActions from "./recipe.actions";

export type State = {
  recipes: Recipe[];
};

const initialState: State = {
  recipes: [],
};

const _recipeReducer = createReducer(
  initialState,
  on(RecipeActions.setRecipes, (state, action) => ({
    ...state,
    recipes: action.recipes,
  })),
  on(RecipeActions.addRecipe, (state, action) => ({
    ...state,
    recipes: [...state.recipes, action.recipe],
  })),
  on(RecipeActions.updateRecipe, (state, action) => ({
    ...state,
    recipes: [
      ...state.recipes.slice(0, action.index),
      { ...action.newRecipe },
      ...state.recipes.slice(action.index + 1),
    ],
  })),
  on(RecipeActions.deleteRecipe, (state, action) => ({
    ...state,
    recipes: [
      ...state.recipes.slice(0, action.index),
      ...state.recipes.slice(action.index + 1),
    ],
  })),
);

export function recipeReducer(state: State, action: Action) {
  return _recipeReducer(state, action);
}
