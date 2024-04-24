import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'postedFilternew'
})
export class postedFilternew implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter(item => {
            const totalInvoiceAmount = String(item.impiHeaderTotalInvoiceAmount);

            return (item.no && item.no.toLowerCase().includes(searchText))
                || (item.sellToCustomerNo && item.sellToCustomerNo.toLowerCase().includes(searchText))
                || (item.sellToCustomerName && item.sellToCustomerName.toLowerCase().includes(searchText))
                || (item.projectCode && item.projectCode.toLowerCase().includes(searchText))
                || (item.amount && item.amount.toLowerCase().includes(searchText))
                || (item.status && item.status.toLowerCase().includes(searchText))
                || (item.departmentName && item.departmentName.toLowerCase().includes(searchText));
        });
    }
}
