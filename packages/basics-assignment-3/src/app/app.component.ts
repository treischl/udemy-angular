import { Component } from "@angular/core";

type Click = {
  curr: boolean;
  next: boolean;
  ts: number;
  index: number;
};

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  displayDetails = false;
  clicks = [] as Click[];
  numClicks = 0;

  toggleDetails() {
    this.clicks.push({
      curr: this.displayDetails,
      next: !this.displayDetails,
      ts: new Date().valueOf(),
      index: this.clicks.length
    });
    this.numClicks++;
    this.displayDetails = !this.displayDetails;
  }

  getBgColor(click: Click) {
    return click.index >= 4 ? "blue" : "default";
  }
}
