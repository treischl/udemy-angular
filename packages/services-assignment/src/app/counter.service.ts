import { Injectable } from "@angular/core";

@Injectable({ providedIn: "any" })
export class CounterService {
  private counter = 0;

  get current() {
    return this.counter;
  }

  public increment() {
    this.counter++;
  }
}
