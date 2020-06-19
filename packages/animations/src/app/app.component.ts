import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  animations: [
    trigger("divState", [
      state(
        "normal",
        style({
          backgroundColor: "red",
          transform: "translateX(0)",
        }),
      ),
      state(
        "highlighted",
        style({
          backgroundColor: "blue",
          transform: "translateX(100px)",
        }),
      ),
      transition("normal <=> highlighted", animate(300)),
    ]),
    trigger("wildState", [
      state(
        "normal",
        style({
          backgroundColor: "red",
          transform: "translateX(0) scale(1)",
          borderRadius: "0px",
        }),
      ),
      state(
        "highlighted",
        style({
          backgroundColor: "blue",
          transform: "translateX(100px) scale(1)",
          borderRadius: "0px",
        }),
      ),
      state(
        "shrunken",
        style({
          backgroundColor: "green",
          transform: "translateX(0) scale(0.5)",
          borderRadius: "0px",
        }),
      ),
      transition("normal => highlighted", animate(300)),
      transition("highlighted => normal", animate(800)),
      transition("shrunken <=> *", [
        style({ backgroundColor: "orange" }),
        animate(1000, style({ borderRadius: "50px" })),
        animate(500),
      ]),
    ]),
    trigger("list1", [
      state(
        "in",
        style({
          opacity: 1,
          transform: "translateX(0)",
        }),
      ),
      transition("void => *", [
        style({
          opacity: 0,
          transform: "translateX(-100px)",
        }),
        animate(300),
      ]),
      transition("* => void", [
        style({
          opacity: 1,
          transform: "translateX(0)",
        }),
        animate(
          300,
          style({
            opacity: 0,
            transform: "translateX(-100px)",
          }),
        ),
      ]),
    ]),
  ],
})
export class AppComponent {
  state = "normal";
  wildState = "normal";
  list = ["Milk", "Sugar", "Bread"];

  onAnimate() {
    this.state = this.toggleState(this.state);
    this.wildState = this.toggleState(this.wildState);
  }

  private toggleState(state: string) {
    return state === "normal" ? "highlighted" : "normal";
  }

  onShrink() {
    this.wildState = "shrunken";
  }

  onAdd(item) {
    this.list.push(item);
  }

  onDelete(item: string) {
    const index = this.list.indexOf(item);
    if (index !== -1) {
      this.list.splice(index, 1);
    }
  }
}
