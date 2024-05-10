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
            const totalInvoiceAmount = String(item.impiHeaderTotalInvoiceAmount);

            return (item.impiHeaderInvoiceType && item.impiHeaderInvoiceType.toLowerCase().includes(searchText))
                || (item.impiHeaderProjectCode && item.impiHeaderProjectCode.toLowerCase().includes(searchText))
                || (item.impiHeaderProjectName && item.impiHeaderProjectName.toLowerCase().includes(searchText))
                || (item.impiHeaderProjectDepartmentName && item.impiHeaderProjectDepartmentName.toLowerCase().includes(searchText))
                || (item.impiHeaderProjectDivisionName && item.impiHeaderProjectDivisionName.toLowerCase().includes(searchText))
                || (item.impiHeaderCustomerName && item.impiHeaderCustomerName.toLowerCase().includes(searchText))
                || (item.impiHeaderCustomerCity && item.impiHeaderCustomerCity.toLowerCase().includes(searchText))
                || (totalInvoiceAmount.includes(searchText))
                || (item.impiHeaderTlApprover && item.impiHeaderTlApprover.toLowerCase().includes(searchText))
                || (item.impiHeaderClusterApprover && item.impiHeaderClusterApprover.toLowerCase().includes(searchText))
                || (item.impiHeaderFinanceApprover && item.impiHeaderFinanceApprover.toLowerCase().includes(searchText))
                || (item.accountApprover && item.accountApprover.toLowerCase().includes(searchText))
                || (item.impiHeaderSubmittedDate && item.impiHeaderSubmittedDate.toLowerCase().includes(searchText))
                || (item.impiHeaderCreatedBy && item.impiHeaderCreatedBy.toLowerCase().includes(searchText))
                || (item.headerRecordID && item.headerRecordID.toLowerCase().includes(searchText))
                || (item.sellToCustomerNo && item.sellToCustomerNo.toLowerCase().includes(searchText))
                || (item.recordID && item.recordID.toLowerCase().includes(searchText))
                || (item.creditMemoNavNo && item.creditMemoNavNo.toLowerCase().includes(searchText))
                || (item.headerPiNo && item.headerPiNo.toLowerCase().includes(searchText))
                || (item.headerStatus && item.headerStatus.toLowerCase().includes(searchText));
        });

    }
}
