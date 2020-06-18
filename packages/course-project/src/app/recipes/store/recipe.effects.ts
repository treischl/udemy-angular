import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { switchMap, map } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import * as RecipeActions from "../store/recipe.actions";
import { Recipe } from "../recipe.model";
import * as fromApp from "../../store/app.reducer";
import { storeRecipesFn } from "./store-recipes.effect";

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap(() =>
      this.http.get<Recipe[]>(`${environment.firebaseApiUrl}/recipes.json`),
    ),
    map((recipes) =>
      recipes.map((recipe) => ({
        ...recipe,
        ingredients:
          recipe.ingredients instanceof Array ? recipe.ingredients : [],
      })),
    ),
    map((recipes) => new RecipeActions.SetRecipes(recipes)),
  );

  @Effect({ dispatch: false })
  storeRecipes = storeRecipesFn(this.actions$, this.http, this.store);

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
  ) {}
}
