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
            return item.headerRecordID.toLowerCase().includes(searchText) ||
             item.customerStatus.toLowerCase().includes(searchText)
             || item.headerPiNo.toLowerCase().includes(searchText)
             || item.impiHeaderProjectCode.toLowerCase().includes(searchText)
             || item.impiHeaderProjectName.toLowerCase().includes(searchText)
             || item.impiHeaderProjectDepartmentName.projectCode().includes(searchText)
             || item.impiHeaderProjectDivisionName.toLowerCase().includes(searchText)
             || item.impiHeaderCustomerName.toLowerCase().includes(searchText)
             || item.impiHeaderCustomerCity.toLowerCase().includes(searchText)
             || item.impiHeaderTotalInvoiceAmount.toLowerCase().includes(searchText)
             || item.impiHeaderTlApprover.toLowerCase().includes(searchText)
             || item.impiHeaderSubmittedDate.toLowerCase().includes(searchText)
             || item.impiHeaderCreatedBy.toLowerCase().includes(searchText)
             || item.headerStatus.toLowerCase().includes(searchText)
             ;
        });
    }
}
