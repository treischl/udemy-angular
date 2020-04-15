import {
  Component,
  ElementRef,
  ViewChild,
  EventEmitter,
  Output,
} from "@angular/core";

import { Ingredient } from "src/app/shared/ingredient.model";
import { ShoppingListService } from "../shopping-list.service";

@Component({
  selector: "app-shopping-list-edit",
  templateUrl: "./shopping-list-edit.component.html",
  styleUrls: ["./shopping-list-edit.component.css"],
})
export class ShoppingListEditComponent {
  @ViewChild("amountInput")
  amountInputRef: ElementRef<HTMLInputElement>;

  @ViewChild("nameInput")
  nameInputRef: ElementRef<HTMLInputElement>;

  @Output()
  ingredientAdded = new EventEmitter<Ingredient>();

  constructor(private shoppingListService: ShoppingListService) {}

  onAddItem() {
    this.shoppingListService.addIngredient(
      new Ingredient(
        this.nameInputRef.nativeElement.value,
        parseInt(this.amountInputRef.nativeElement.value, 10),
      ),
    );
  }
}
