import { Item } from './../item';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'itemFilter'
})
export class ItemFilterPipe implements PipeTransform {
  transform(items: Item[], filterTxt: string): Item[] {
    if (filterTxt === '') {
      return items;
    }
    if (!items) {
      return [];
    }
    const filterArray = items.filter(item => {
      return item.name.includes(filterTxt);
    });
    return filterArray;
  }
}
