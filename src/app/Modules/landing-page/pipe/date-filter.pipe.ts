import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFilter'
})
export class DateFilterPipe implements PipeTransform {
  transform(items: any[], fromDate: Date, toDate: Date): any[] {
    if (!items || !fromDate || !toDate) {
      return items;
    }
    return items.filter(item => {
      const itemDate = new Date(item.createdOn);
      return itemDate >= fromDate && itemDate <= toDate;
    });
  }
}
