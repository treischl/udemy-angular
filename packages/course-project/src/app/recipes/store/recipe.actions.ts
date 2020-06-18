import { Action } from "@ngrx/store";

import { Recipe } from "../recipe.model";
import { ADD_RECIPE, AddRecipe } from "./add-recipe.action";
import { UPDATE_RECIPE, UpdateRecipe } from "./update-recipe.action";
import { DELETE_RECIPE, DeleteRecipe } from "./delete-recipe.action";
import { STORE_RECIPES, StoreRecipes } from "./store-recipes.effect";

export const SET_RECIPES = "[recipes] SET_RECIPES";
export const FETCH_RECIPES = "[recipes] FETCH_RECIPES";

export class SetRecipes implements Action {
  readonly type = SET_RECIPES;

  constructor(public payload: Recipe[]) {}
}

export class FetchRecipes implements Action {
  readonly type = FETCH_RECIPES;
}

export {
  ADD_RECIPE,
  AddRecipe,
  UPDATE_RECIPE,
  UpdateRecipe,
  DELETE_RECIPE,
  DeleteRecipe,
  STORE_RECIPES,
  StoreRecipes,
};

export type RecipeActions =
  | SetRecipes
  | AddRecipe
  | UpdateRecipe
  | DeleteRecipe
  | StoreRecipes;
