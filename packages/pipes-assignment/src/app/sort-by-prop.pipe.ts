import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sortByProp",
})
export class SortByPropPipe implements PipeTransform {
  transform<K>(value: K[], propName: keyof K): unknown {
    return value.sort((a, b) => {
      if (a[propName] < b[propName]) {
        return -1;
      }
      if (a[propName] > b[propName]) {
        return 1;
      }
      return 0;
    });
  }
}
