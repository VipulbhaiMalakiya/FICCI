import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchFilter'
})
export class SearchFilterPipe1 implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter(item => {
            return item.impiHeaderProjectCode.toLowerCase().includes(searchText)
                || item.impiHeaderInvoiceType.toLowerCase().includes(searchText)
                || item.impiHeaderProjectDepartmentName.toLowerCase().includes(searchText)
                || item.impiHeaderCustomerName.toLowerCase().includes(searchText);
        });
    }
}
