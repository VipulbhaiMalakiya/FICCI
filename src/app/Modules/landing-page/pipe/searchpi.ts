import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchFilter1'
})
export class SearchFilterPipe1 implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter(item => {
            const totalInvoiceAmount = String(item.impiHeaderTotalInvoiceAmount);
            return item.impiHeaderInvoiceType.toLowerCase().includes(searchText)
                || item.impiHeaderProjectCode.toLowerCase().includes(searchText)
                || item.impiHeaderProjectName.toLowerCase().includes(searchText)
                || item.impiHeaderProjectDepartmentName.toLowerCase().includes(searchText)
                || item.impiHeaderProjectDivisionName.toLowerCase().includes(searchText)
                || item.impiHeaderCustomerName.toLowerCase().includes(searchText)
                || item.impiHeaderCustomerCity.toLowerCase().includes(searchText)
                || totalInvoiceAmount.includes(searchText)
                || item.impiHeaderTlApprover.toLowerCase().includes(searchText)
                || item.impiHeaderClusterApprover.toLowerCase().includes(searchText)
                || item.impiHeaderFinanceApprover.toLowerCase().includes(searchText)
                || item.accountApprover.toLowerCase().includes(searchText)
                || item.impiHeaderSubmittedDate.toLowerCase().includes(searchText)
                || item.impiHeaderCreatedBy.toLowerCase().includes(searchText)
                || item.headerStatus.toLowerCase().includes(searchText);
        });
    }
}
