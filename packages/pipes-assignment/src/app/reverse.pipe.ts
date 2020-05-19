import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "reverse",
})
export class ReversePipe implements PipeTransform {
  transform(value: string | any[]): string | any[] {
    if (typeof value === "string") {
      return [...value].reverse().join("");
    }
    return value.reverse();
  }
}
