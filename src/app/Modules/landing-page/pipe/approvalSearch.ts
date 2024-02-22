import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'approvalsearchFilter'
})
export class ApprovalSearchFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter(item => {
            return item.customerName.toLowerCase().includes(searchText) || item.cityCode.toLowerCase().includes(searchText);
        });
    }
}
