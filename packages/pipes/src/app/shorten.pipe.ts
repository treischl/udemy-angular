import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "shorten",
})
export class ShortenPipe implements PipeTransform {
  transform(value: string, limit: number): unknown {
    return value.length > limit ? value.substring(0, limit) + " ..." : value;
  }
}
