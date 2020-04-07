import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  gameTicks: number[] = [];

  onGameStarted() {
    this.gameTicks.length = 0;
  }

  onGameInProgress(tick: number) {
    this.gameTicks.push(tick);
  }
}
