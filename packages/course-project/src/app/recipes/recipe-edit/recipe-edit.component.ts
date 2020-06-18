import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";

import * as fromApp from "../../store/app.reducer";
import * as RecipeActions from "../store/recipe.actions";

@Component({
  selector: "app-recipe-edit",
  templateUrl: "./recipe-edit.component.html",
  styleUrls: ["./recipe-edit.component.css"],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  formSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>,
  ) {}

  get ingredientControls() {
    return (this.recipeForm.get("ingredients") as FormArray).controls;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.editMode = params["id"] !== null && params["id"] !== undefined;
      this.id = this.editMode ? parseInt(params["id"]) : null;
      this.initForm();
    });
  }

  ngOnDestroy() {
    this.formSubscription?.unsubscribe();
  }

  onSubmit() {
    if (this.editMode) {
      this.store.dispatch(
        new RecipeActions.UpdateRecipe({
          index: this.id,
          newRecipe: this.recipeForm.value,
        }),
      );
    } else {
      this.store.dispatch(new RecipeActions.AddRecipe(this.recipeForm.value));
    }
    this.router.navigate([".."], { relativeTo: this.route });
  }

  onCancel() {
    this.router.navigate([".."], { relativeTo: this.route });
  }

  onAddIngredient() {
    (this.recipeForm.get("ingredients") as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+\d*$/),
        ]),
      }),
    );
  }

  onDeleteIngredient(index: number) {
    (this.recipeForm.get("ingredients") as FormArray).removeAt(index);
  }

  private initForm() {
    let recipeName = "";
    let recipeImagePath = "";
    let recipeDescription = "";
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.formSubscription = this.store
        .select("recipes")
        .pipe(map((recipeState) => recipeState.recipes[this.id]))
        .subscribe((recipe) => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;
          if (
            recipe.ingredients instanceof Array &&
            recipe.ingredients.length > 0
          ) {
            for (let ingredient of recipe.ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  name: new FormControl(ingredient.name, Validators.required),
                  amount: new FormControl(ingredient.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+\d*$/),
                  ]),
                }),
              );
            }
          }
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }
}
