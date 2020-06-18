import { Actions, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { HttpClient } from "@angular/common/http";
import { switchMap, map, withLatestFrom } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import * as fromApp from "../../store/app.reducer";

export const STORE_RECIPES = "[recipes] STORE_RECIPES";

export class StoreRecipes implements Action {
  readonly type = STORE_RECIPES;
}

export function storeRecipesFn(
  actions$: Actions,
  http: HttpClient,
  store: Store<fromApp.AppState>,
) {
  return actions$.pipe(
    ofType(STORE_RECIPES),
    withLatestFrom(store.select("recipes")),
    map(([_, recipeState]) => recipeState.recipes),
    switchMap((recipes) =>
      http.put(`${environment.firebaseApiUrl}/recipes.json`, recipes),
    ),
  );
}
