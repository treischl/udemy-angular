import * as RecipeActions from "./recipe.actions";
import { Recipe } from "../recipe.model";
import { addRecipeFn } from "./add-recipe.action";
import { updateRecipeFn } from "./update-recipe.action";
import { deleteRecipeFn } from "./delete-recipe.action";

export type State = {
  recipes: Recipe[];
};

const initialState: State = {
  recipes: [],
};

export function recipeReducer(
  state = initialState,
  action: RecipeActions.RecipeActions,
) {
  switch (action.type) {
    case RecipeActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload],
      };
    case RecipeActions.ADD_RECIPE:
      return addRecipeFn(state, action);
    case RecipeActions.UPDATE_RECIPE:
      return updateRecipeFn(state, action);
    case RecipeActions.DELETE_RECIPE:
      return deleteRecipeFn(state, action);
    default:
      return state;
  }
}
