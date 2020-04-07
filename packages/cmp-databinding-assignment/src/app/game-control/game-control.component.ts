import { Component, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-game-control",
  templateUrl: "./game-control.component.html",
  styleUrls: ["./game-control.component.css"],
})
export class GameControlComponent {
  interval: number = -1;
  gameCounter: number = 0;
  @Output() gameStarted = new EventEmitter();
  @Output() gameInProgress = new EventEmitter<number>();

  onStartGame() {
    this.gameStarted.emit();
    this.interval = setInterval(() => {
      this.gameCounter++;
      this.gameInProgress.emit(this.gameCounter);
    }, 1000);
  }

  onEndGame() {
    if (this.interval >= 0) {
      clearInterval(this.interval);
      this.interval = -1;
      this.gameCounter = 0;
    }
  }
}
