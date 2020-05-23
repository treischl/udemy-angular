import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

import { Recipe } from "../recipes/recipe.model";

const baseUrl = "https://udemy-ng-course-project-1a1a1.firebaseio.com";

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(private http: HttpClient) {}

  storeRecipes(recipes: Recipe[]) {
    this.http.put(`${baseUrl}/recipes.json`, recipes).subscribe((response) => {
      console.log(response);
    });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(`${baseUrl}/recipes.json`).pipe(
      map((recipes) =>
        recipes.map((recipe) => ({
          ...recipe,
          ingredients:
            recipe.ingredients instanceof Array ? recipe.ingredients : [],
        })),
      ),
    );
  }
}
