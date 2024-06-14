import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter(item => {
            return (item.customerName && item.customerName.toLowerCase().includes(searchText)) ||
                (item.cityList && item.cityList.cityName && item.cityList.cityName.toLowerCase().includes(searchText)) ||
                (item.address && item.address.toLowerCase().includes(searchText)) ||
                (item.phoneNumber && item.phoneNumber.toLowerCase().includes(searchText)) ||
                (item.gstNumber && item.gstNumber.toLowerCase().includes(searchText)) ||
                (item.pan && item.pan.toLowerCase().includes(searchText)) ||
                (item.createdOn && item.createdOn.toLowerCase().includes(searchText)) ||
                (item.createdBy && item.createdBy.toLowerCase().includes(searchText)) ||
                (item.customerStatus && item.customerStatus.toLowerCase().includes(searchText)) ||
                (item.customerCode && item.customerCode.toLowerCase().includes(searchText)) ||
                (item.recordID && item.recordID.toLowerCase().includes(searchText));
        });

    }
}
