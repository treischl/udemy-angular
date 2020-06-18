import { createReducer, on, Action } from "@ngrx/store";

import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

export type State = {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
};

const initialState: State = {
  ingredients: [new Ingredient("Apples", 5), new Ingredient("Tomatoes", 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

const _shoppingListReducer = createReducer(
  initialState,
  on(ShoppingListActions.addIngredient, (state, action) => ({
    ...state,
    ingredients: [...state.ingredients, action.ingredient],
  })),
  on(ShoppingListActions.addIngredients, (state, action) => ({
    ...state,
    ingredients: [...state.ingredients, ...action.ingredients],
  })),
  on(ShoppingListActions.updateIngredient, (state, action) => ({
    ...state,
    ingredients: [
      ...state.ingredients.slice(0, state.editedIngredientIndex),
      action.ingredient,
      ...state.ingredients.slice(state.editedIngredientIndex + 1),
    ],
    editedIngredientIndex: -1,
    editedIngredient: null,
  })),
  on(ShoppingListActions.deleteIngredient, (state) => ({
    ...state,
    ingredients: state.ingredients.filter(
      (_, index) => index !== state.editedIngredientIndex,
    ),
    editedIngredientIndex: -1,
    editedIngredient: null,
  })),
  on(ShoppingListActions.startEdit, (state, action) => ({
    ...state,
    editedIngredient: { ...state.ingredients[action.index] },
    editedIngredientIndex: action.index,
  })),
  on(ShoppingListActions.stopEdit, (state) => ({
    ...state,
    editedIngredient: null,
    editedIngredientIndex: -1,
  })),
);

export function shoppingListReducer(state: State, action: Action) {
  return _shoppingListReducer(state, action);
}
