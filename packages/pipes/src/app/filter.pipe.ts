import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filter",
  pure: false,
})
export class FilterPipe implements PipeTransform {
  transform<K>(value: K[], filterString: string, propName: keyof K): unknown {
    return value.length === 0 || filterString === ""
      ? value
      : value.filter((item) => (item[propName] as any) === filterString);
  }
}
