import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'salessearchFilter'
})
export class SalesSearchFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();

        return items.filter(item => {

            return (item.no && item.no.toLowerCase().includes(searchText))
                || (item.postingDate && item.postingDate.toLowerCase().includes(searchText))
                || (item.invoice_no && item.invoice_no.toLowerCase().includes(searchText))
                || (item.sellToCustomerNo && item.sellToCustomerNo.toLowerCase().includes(searchText))
                || (item.sellToCustomerName && item.sellToCustomerName.toLowerCase().includes(searchText))
                || (item.createdByUser && item.createdByUser.toLowerCase().includes(searchText))
                || (item.departmentName && item.departmentName.toLowerCase().includes(searchText))
                || (item.divisionName && item.divisionName.toLowerCase().includes(searchText))
                || (item.gsT_No && item.gsT_No.toLowerCase().includes(searchText))
                || (item.invoicePortalOrder && item.invoicePortalOrder.toLowerCase().includes(searchText))
                || (item.invoicePortalSubmitted && item.invoicePortalSubmitted.toLowerCase().includes(searchText))
                || (item.projectCode && item.projectCode.toLowerCase().includes(searchText))
                || (item.paN_NO && item.paN_NO.toLowerCase().includes(searchText))
                || (item.sellToAddress && item.sellToAddress.toLowerCase().includes(searchText))
                || (item.sellToCity && item.sellToCity.toLowerCase().includes(searchText))
                || (item.sellToPostCode && item.sellToPostCode.toLowerCase().includes(searchText))
                || (item.typeOfSupply && item.typeOfSupply.toLowerCase().includes(searchText))
                || (item.yourReference && item.yourReference.toLowerCase().includes(searchText));

        });

    }
}
