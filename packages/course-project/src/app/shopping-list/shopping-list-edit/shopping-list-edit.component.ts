import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  EventEmitter,
  Output,
} from "@angular/core";

import { Ingredient } from "src/app/shared/ingredient.model";

@Component({
  selector: "app-shopping-list-edit",
  templateUrl: "./shopping-list-edit.component.html",
  styleUrls: ["./shopping-list-edit.component.css"],
})
export class ShoppingListEditComponent implements OnInit {
  @ViewChild("amountInput")
  amountInputRef: ElementRef<HTMLInputElement>;

  @ViewChild("nameInput")
  nameInputRef: ElementRef<HTMLInputElement>;

  @Output()
  ingredientAdded = new EventEmitter<Ingredient>();

  constructor() {}

  ngOnInit(): void {}

  onAddItem() {
    this.ingredientAdded.emit(
      new Ingredient(
        this.nameInputRef.nativeElement.value,
        parseInt(this.amountInputRef.nativeElement.value, 10),
      ),
    );
  }
}
