import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { switchMap, map, withLatestFrom } from "rxjs/operators";

import { environment } from "src/environments/environment";
import * as fromApp from "../../store/app.reducer";
import * as RecipeActions from "../store/recipe.actions";
import { Recipe } from "../recipe.model";

@Injectable()
export class RecipeEffects {
  fetchRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipeActions.fetchRecipes),
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
      map((recipes) => RecipeActions.setRecipes({ recipes })),
    ),
  );

  storeRecipes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipeActions.storeRecipes),
        withLatestFrom(this.store.select("recipes")),
        map(([_, recipeState]) => recipeState.recipes),
        switchMap((recipes) =>
          this.http.put(`${environment.firebaseApiUrl}/recipes.json`, recipes),
        ),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
  ) {}
}
