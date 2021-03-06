import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { Ingredient } from "src/app/shared/ingredient.model";
import * as fromApp from "../../store/app.reducer";
import * as ShoppingListActions from "../store/shopping-list.actions";

@Component({
  selector: "app-shopping-list-edit",
  templateUrl: "./shopping-list-edit.component.html",
  styleUrls: ["./shopping-list-edit.component.css"],
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  @ViewChild("f", { static: false }) shoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;

  constructor(private store: Store<fromApp.AppState>) {}

  onAddItem(form: NgForm) {
    const ingredient = new Ingredient(form.value.name, form.value.amount);
    if (this.editMode) {
      this.store.dispatch(ShoppingListActions.updateIngredient({ ingredient }));
      this.editMode = false;
    } else {
      this.store.dispatch(ShoppingListActions.addIngredient({ ingredient }));
    }
    form.reset();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
    this.store.dispatch(ShoppingListActions.stopEdit());
  }

  onDelete() {
    if (this.editMode) {
      this.store.dispatch(ShoppingListActions.deleteIngredient());
      this.onClear();
    }
  }

  ngOnInit(): void {
    this.subscription = this.store.select("shoppingList").subscribe((state) => {
      this.editMode = state.editedIngredientIndex > -1;
      console.log(
        "ShoppingListEdit.ngOnInit: this.editMode = " + this.editMode,
      );
      if (this.editMode) {
        this.shoppingListForm.setValue({
          name: state.editedIngredient.name,
          amount: state.editedIngredient.amount,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(ShoppingListActions.stopEdit());
  }
}
