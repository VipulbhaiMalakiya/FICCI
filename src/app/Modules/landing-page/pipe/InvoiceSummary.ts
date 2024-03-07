import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'invoiceFilter'
})
export class invoiceFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter(item => {
            return item.no.toLowerCase().includes(searchText) ||
             item.postingDate.cityName.toLowerCase().includes(searchText)
             || item.invoice_no.toLowerCase().includes(searchText)
             || item.sellToCustomerNo.toLowerCase().includes(searchText)
             || item.sellToCustomerName.toLowerCase().includes(searchText)
             || item.pan.projectCode().includes(searchText)
             || item.departmentName.toLowerCase().includes(searchText)
             || item.divisionName.toLowerCase().includes(searchText)
             ;
        });
    }
}
