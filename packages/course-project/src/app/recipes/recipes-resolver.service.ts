import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { take, map, switchMap } from "rxjs/operators";

import * as fromApp from "../store/app.reducer";
import { Recipe } from "./recipe.model";
import * as RecipeActions from "./store/recipe.actions";

@Injectable({ providedIn: "root" })
export class RecipesResolverService implements Resolve<{ recipes: Recipe[] }> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select("recipes").pipe(
      take(1),
      map((recipeState) => recipeState.recipes),
      switchMap((recipes) => {
        if (recipes.length === 0) {
          this.store.dispatch(RecipeActions.fetchRecipes());
          return this.actions$.pipe(ofType(RecipeActions.setRecipes), take(1));
        } else {
          return of({ recipes });
        }
      }),
    );
  }
}
